FROM node:12.14 as build

RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./

RUN npm run build

FROM node:12.14-alpine as prod
RUN mkdir /app
WORKDIR /app
COPY --from=build /app/package* ./
RUN npm install --only=production
COPY --from=build /app/build/src ./src
EXPOSE 8090
CMD node ./src/main
