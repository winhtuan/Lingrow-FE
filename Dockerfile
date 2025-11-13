# ===== Build FE (CRA + Tailwind CLI) =====
FROM node:20-alpine AS build
WORKDIR /app

# Copy manifest trước để cache install
COPY package*.json ./
RUN npm ci

# Copy source
COPY public ./public
COPY src ./src

# Build FE (đang dùng react-scripts + tailwind cli qua prebuild)
RUN npm run build

# ===== Serve FE bằng Nginx + reverse proxy /api =====
FROM nginx:alpine AS runtime
WORKDIR /usr/share/nginx/html
# Copy build output
COPY --from=build /app/build ./
# Copy cấu hình nginx reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
