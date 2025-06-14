FROM node:22 AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

ARG MODE
RUN npm run build -- --mode $MODE


FROM node:22-alpine

WORKDIR /frontend

RUN npm install -g serve --no-cache

COPY --from=build /frontend/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
