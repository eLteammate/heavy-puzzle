# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production && npm install serve -g
COPY . .
ARG REACT_APP_API_URL
RUN REACT_APP_API_URL=$REACT_APP_API_URL npm run build
CMD ["serve", "-s", "build", "-p", "3000"]
