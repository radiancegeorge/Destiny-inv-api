FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn
EXPOSE 4000
CMD [ "yarn", "start" ]