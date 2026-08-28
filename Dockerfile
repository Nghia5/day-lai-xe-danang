# Sử dụng môi trường Node.js
FROM node:18-alpine

# Cài đặt thư mục làm việc
WORKDIR /app

# Copy các file cấu hình và cài đặt thư viện
COPY package*.json ./
RUN npm install

# Copy toàn bộ code vào
COPY . .

# Mở port (điều chỉnh lại nếu server.js của bạn không dùng port 3000)
EXPOSE 3000

# Lệnh chạy app
CMD ["node", "server.js"]