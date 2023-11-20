# SE Project Express

This project is the back end for the WTWR application. It's a server responsible for handling
http requests from SE Project React.

# Technologies Used

Express JS, MongoDB, MongoDB Compass, Postman and Validation

## Express JS

Express.js is responsible for creating the sever, creating routes,
listening for http requests, & then routing those requests appropriately.

## Database & Mapper

MongoDB is used as our NoSQL database. In this app Mongoose is used to define the shape of the
documents that get stored in MongoDB via Mongoose.Schema(). Models in Mongoose are used to
create, cast, store, delete, & query data.

## Validation

Validator.js is used to verify that certain properties in the schemas,
avatar & imageUrl, are valid URLs.

## Hot Reload

SE Project Express uses nodemon to enable hot reloading, or the ability for the server
to refresh itself whenever source code is changed.

## Link

[Link to site](https://wtwr.happyforever.com)
