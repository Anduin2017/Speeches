# ============================
# Prepare Build Environment
FROM --platform=$BUILDPLATFORM hub.aiursoft.com/node:24-alpine AS npm-env
WORKDIR /src

# 1. 安装系统依赖 (Pandoc)
# 将其放在最前，因为通常不会频繁更换基础系统库
RUN apk add --no-cache pandoc

# 2. 拷贝并安装项目依赖包 (Node Module)
# 将 package.json 等单独复制并 install，这样只要依赖不修改，就可以利用 Docker 缓存
COPY package.json package-lock.json* ./
RUN npm install --loglevel verbose

# 3. 拷贝项目源码并编译
# 这一步变化最频繁
COPY . .
RUN npm run prod

# ============================
# Prepare Runtime Environment
FROM hub.aiursoft.com/aiursoft/static
# 只将构建生成的 dist 目录内容复制到静态服务器根目录
COPY --from=npm-env /src/dist /data
