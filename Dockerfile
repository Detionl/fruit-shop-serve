# 加载基础镜像
FROM mhart/alpine-node

# 注释
LABEL maintainer = "lmjben <yinhengliben@gmail.com>"

# 创建工作目录
RUN rm -rf /app
RUN mkdir /app
WORKDIR /app

# 安装项目依赖
COPY . /app
RUN npm install
RUN npm run build
RUN mv ./dist/* ./

# 对外暴露端口
EXPOSE 8082

# 启动 Image 时执行命令
CMD BUILD_ENV=docker node app.js
