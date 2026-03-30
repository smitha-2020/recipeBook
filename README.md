![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-v7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)![Docker](https://img.shields.io/badge/Docker-blue?style=for-the-badge&logo=docker&logoColor=white)


RECIPE BOOK BACKEND

I have developed a mobile application(react native) for the RecipeBook which has static data. I wanted to develop a backend for it in Nodejs and Express during my free time.I have below listed API endpoints. Also endpoints conforms to the RESTful principles.

Description:

- MiddleWare.
- Mongoose ORM
- Typescript
- Authentication and Authorization.
- Validating user inputs with Joi Validation
- Used Migration.

Endpoints:

User/Authentication:
```sh

POST http://localhost/api/user/register
GET http://localhost/api/user/me
GET http://localhost/api/user/logout

```

Authorization:

```sh 

POST http://localhost/api/auth

```

Recipes:

```sh 

GET http://localhost/api/recipe
GET http://localhost/api/recipe/:id
POST http://localhost/api/recipe
PUT http://localhost/api/recipe/:id
DELETE http://localhost/api/recipe/:id

```


Category:

```sh 

GET http://localhost/api/category
GET http://localhost/api/category/:id
POST http://localhost/api/category
PUT http://localhost/api/category/:id
DELETE http://localhost/api/category/:id

```

## Tech Stack

Bakend for the RecipeBook is developed 
- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [MongoDB](https://breakdance.github.io/breakdance/)  - NoSQL database that stores data as JSON-like documents
- [Docker](https://breakdance.github.io/breakdance/) - Platform for developing, shipping, and running applications

## Installation
To get all the containers up and running run the docker compose up command on detached mode(-d) 
```sh
docker compose up -d
```

Get the containers and volumes down
```sh
docker compose down -v
```

