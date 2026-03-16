FROM node:25-alpine

RUN addgroup app && adduser -S app -G app


WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

RUN chown -R app:app /app
USER app

EXPOSE 3000

CMD ["npm","start"]
