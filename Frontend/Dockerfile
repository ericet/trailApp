FROM node:18.15 AS frontend-build
WORKDIR /usr/src/app/TRAILAPP/Frontend

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=frontend-build /usr/src/app/TRAILAPP/Frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]