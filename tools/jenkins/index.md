### jenkins

#### 1、基础搭建

> [使用docker搭建jenkins](https://juejin.cn/post/7049920990351982628)

#### 2、执行构建脚本

```shell
node -v
npm install
npm run build:test
cd dist
rm -rf web_admin.tar.gz 
tar -zcvf web_admin.tar.gz * 
pwd
cd ../
```

#### 3、构建后的操作

```shell
# 将构建的压缩包移动到目标服务器的制定文件夹下解压缩
dist/*.tar.gz   # Transfer Set Source files      dist目录下的所有压缩文件
dist/  # Remove prefix 
usr/local/nginx/html/dev  #Remote directory 

## 执行脚本
cd /usr/local/nginx/html/dev/web
tar -zcpf ../web_back.tar.gz * # 将web目录整体备份
cd ..
rm -rf  web
mkdir  web
tar -zxvf web_admin.tar.gz -C web/
rm -rf web_admin.tar.gz

```

