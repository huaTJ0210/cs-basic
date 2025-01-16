## pm2

### 1、基本操作

```shell
# 安装
npm install -g pm2
# 启动项目
pm2 start ./dist/main.js
# 查看日志
pm2 logs
# 限制内存重新
pm2 start xxx --max-memory-restart 200M
# 设置进程数量，最大可能利用目标服务器的CPU核心数 
pm2 start app.js -i max 
```

### 2、使用docker构建nest项目

```dockerfile
FROM node:18-alpine3.19 as build-stage

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:18-alpine3.19 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm install --production

RUN npm install -g pm2

EXPOSE 3000

CMD ["pm2-runtime", "/app/main.js"]
```

