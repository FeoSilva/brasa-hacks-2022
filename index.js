require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');

// API Routes
const locationFunc = require('./routes/v1/location/:zipcode/func.js')

app.use(
  cors({
      credentials: true,
      origin: true
  })
);
app.options('*', cors());

app.get('/', (req, res) => res.send('Alive!!!'));
app.get('/v1/location/:zipcode', locationFunc);

app.listen(process.env.PORT || 3000, function() {
  console.log('Server running on port 3000', '');
});