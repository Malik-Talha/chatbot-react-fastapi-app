FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]