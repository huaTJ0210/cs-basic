> 身份认证系统如果采用的是 access_token&&refresh_token，网络请求的结果会遇到 access_token 过期的情况，这时就需要采用 refresh_token 去换取新的 access_token，在此场景下需要解决如下问题：
>
> - 如何对网络请求进行统一的错误处理？
>   - 结合 axios 的响应拦截，对于网络错误分类处理
> - 如何进行 access_token 的更新？
>   - 当网络请求的结果是 token 过期时，重新利用 refresh_token 发送请求换取 access_token
> - 当多个请求遇到 access_token 过期时，如何保证无感知的进行 access_token 的更新？
>   - 当前正在进行 refresh token 操作时，需要将此周期内系统发送的其他请求挂起，当 token 刷新成功后再次一一进行调用

<!--more-->

```ts
import axios from 'axios';
import store from '@/store';
import { Message } from 'element-ui';
import router from '@/router';
import qs from 'qs';

// 创建请求对象
const request = axios.create({});

// 重定向到登录页面
function redirectLogin() {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
}

// 刷新access_token;
function refreshToken() {
  // 这里必须重新创建axios请求，避免流程再次走到响应拦截器中，导致死循环
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      // refresh_token 只能使用1次
      refreshtoken: store.state.user.refresh_token
    })
  });
}

// ----- 请求拦截器 -----
request.interceptors.request.use(
  function (config) {
    // 统一配置请求信息：例如增加token
    const { user } = store.state;
    if (user && user.access_token) {
      config.headers.Authorization = user.access_token;
    }
    // 注意：这里一定要返回 config，否则请求就发不出去了
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

//  -----  响应拦截器 -----
let isRefreshing = false; // 控制刷新 token 的状态
let requests: any[] = []; // 存储刷新 token 期间过来的 401 请求

request.interceptors.response.use(
  function (response) {
    // HTTP状态码为 2xx 都会进入这里
    return response;
  },
  async function (error) {
    // HTTP状态码超出 2xx 状态码都都执行这里
    if (error.response) {
      // 请求发出去收到响应了，但是状态码超出了 2xx 范围
      const { status } = error.response;
      if (status === 400) {
        Message.error('请求参数错误');
      } else if (status === 401) {
        // token 无效（没有提供 token、token 是无效的、token 过期了）
        // 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
        if (!store.state.user) {
          redirectLogin();
          return Promise.reject(error);
        }
        // 刷新 token
        if (!isRefreshing) {
          isRefreshing = true; // 开启刷新状态
          // 尝试刷新获取新的 token
          return refreshToken()
            .then((res) => {
              if (!res.data.success) {
                throw new Error('刷新 Token 失败');
              }
              // 刷新 token 成功了
              store.commit('setUser', res.data.content);
              // 把 requests 队列中的请求重新发出去
              requests.forEach((cb) => cb());
              // 重置 requests 数组
              requests = [];
              // 重新发起第一次响应为401的请求
              return request(error.config);
            })
            .catch((err) => {
              store.commit('setUser', null);
              redirectLogin();
              return Promise.reject(error);
            })
            .finally(() => {
              isRefreshing = false; // 重置刷新状态
            });
        }

        // 【多个请求遇到401的情况】刷新状态下，把请求挂起放到 requests 数组中
        return new Promise((resolve) => {
          requests.push(() => {
            resolve(request(error.config));
          });
        });
      } else if (status === 403) {
        Message.error('没有权限，请联系管理员');
      } else if (status === 404) {
        Message.error('请求资源不存在');
      } else if (status >= 500) {
        Message.error('服务端错误，请联系管理员');
      }
    } else if (error.request) {
      // 请求发出去没有收到响应
      Message.error('请求超时，请刷新重试');
    } else {
      // 在设置请求时发生了一些事情，触发了一个错误
      Message.error(`请求失败：${error.message}`);
    }

    // 把请求失败的错误对象继续抛出，扔给上一个调用者
    return Promise.reject(error);
  }
);

export default request;
```
