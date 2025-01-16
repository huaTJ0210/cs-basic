## Docker

### 1、Docker 参考手册

> [手册](https://github.com/jaywcjlove/docker-tutorial)

### 2、Docker 部署前端项目

> 

#### 1、创建dockerfile文件，编写构建指令

```dockerfile
# 使用 node 镜像
FROM node:18.0-alpine3.14 AS build
# 设置容器内的目录，通常我们会使用 app 目录
WORKDIR /app
# 项目文件拷贝到容器 /app 下
COPY . .
# 下载依赖包，并构建打包文件
RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

RUN npm run build


# 使用 nginx 镜像
FROM nginx
# 将我们自定义的nginx配置文件复制到容器中
COPY nginx.conf /etc/nginx/nginx.conf
# 跳转到 nginx 的 80 静态服务对应的目录
WORKDIR /usr/share/nginx/html
# 删掉里面的文件
RUN rm -rf ./*
# 将我们在 node 镜像的打包文件拷贝到这里
COPY --from=build app/dist .
# 暴露80端口，允许外部访问
EXPOSE 80
# 启动nginx服务
CMD ["nginx", "-g", "daemon off;"]
```

#### 2、 编写.dockerignore

```dockerfile
*.md
!README.md
node_modules/
[a-c].txt
.git/
.DS_Store
.vscode/
.dockerignore
.eslintignore
.eslintrc
.prettierrc
.prettierignore
```

#### 3、编写nginx.conf文件

```nginx
# 定义Nginx用户和工作进程数量
user  nginx;
worker_processes  1;

# 指定错误日志的位置和级别
error_log  /var/log/nginx/error.log warn;
# 存储Nginx进程ID的文件路径
pid        /var/run/nginx.pid;

# 事件模块配置
events {
    # 每个worker进程可以同时处理的最大连接数
    worker_connections  1024;
}

# HTTP模块配置
http {
    # 包含MIME类型定义文件
    include       /etc/nginx/mime.types;
    # 默认文件类型
    default_type  application/octet-stream;

    # 定义日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    # 指定访问日志的位置和格式
    access_log  /var/log/nginx/access.log  main;

    # 启用高效文件传输模式
    sendfile        on;

    # 设置keep-alive连接的超时时间
    keepalive_timeout  65;

    # 服务器配置
    server {
        # 监听端口
        listen       80;
        # 服务器名称
        server_name  localhost;

        # 位置配置
        location / {
            # 网站文件的根目录
            root   /usr/share/nginx/html;
            # 默认索引文件
            index  index.html index.htm;
            # 尝试按顺序匹配请求的 URI，如果找不到则返回 index.html，适用于单页应用的路由
            try_files $uri $uri/ /index.html;
        }

        # 定义错误页面
        error_page   500 502 503 504  /50x.html;
        # 配置50x错误页面的路径
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
}
```

#### 4、执行构建镜像

```shell
sudo docker build -t react-app:1.0.0 .  # 使用当前项目下的dockerfile构建 --  react-app:1.0.0 名称:标签  
```

#### 5、启动镜像

```shell
# -p 8080:80 将主机的8088端口映射到容器的80端口
# -d 守护进程
docker run -d -p 8080:80 react-app  
```

