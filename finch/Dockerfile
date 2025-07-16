FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose port 5173 for Vite dev server
EXPOSE 5173

# Make sure Vite binds to all interfaces in container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
