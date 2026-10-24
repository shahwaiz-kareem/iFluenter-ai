FROM node:22-slim

WORKDIR /app

# 2. Copy dependency files
COPY package*.json ./

# 3. Install dependencies
RUN npm install --production

# 4. Copy your backend code
COPY . .

# 5. Expose your port
EXPOSE 3000

ENV TZ=UTC

# 6. Start the app using the modern env flag
# Replace .env with your actual filename if it's different
CMD ["node","app.js"]
