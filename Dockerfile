# 使用 Node.js 基础镜像
FROM node:23.2.0

# 设置工作路径
WORKDIR /

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install --production

# 复制项目代码
COPY . /app

# 暴露服务端口
EXPOSE 7777

# 容器启动时运行的命令
CMD ["node", "/app/server.js"]
