FROM node:16-slim AS frontend-build
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .
# Build the React app
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]