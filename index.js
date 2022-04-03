require('dotenv').config()
const express = require('express');
const app = express();
const locationFunc = require('./routes/v1/location/:zipcode/func.js')

app.get('/v1/location/:zipcode', locationFunc);

try {
  app.listen(3000)
  console.log("Server started on port 3000")
} catch(error) {
  console.log("Error to start server")
  console.error(error)
}