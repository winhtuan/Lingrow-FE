# ===== Build FE (CRA + Tailwind CLI) =====
FROM node:20-alpine AS build
WORKDIR /app

# Copy manifest
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy config
COPY tailwind.config.js ./

# Copy sources
COPY public ./public
COPY src ./src

# Build (tailwind + CRA)
RUN npm run build

# ===== NGINX serve =====
FROM nginx:alpine AS runtime
WORKDIR /usr/share/nginx/html

COPY --from=build /app/build ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
