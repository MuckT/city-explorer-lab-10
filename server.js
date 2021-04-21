'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

const getWeather = require('./handlers/weather');
const errorHandler = require('./handlers/error');
const app = express();
const PORT = process.env.PORT || 3001

// Cors Fix
app.use(cors());

app.use(errorHandler)

app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.get('/weather', getWeather);

// function weatherHandler(request, response) {
//   const { lat, lon } = request.query;
//   getWeather(lat, lon)
//   .then(summaries => response.send(summaries))
//   .catch((error) => {
//     console.error(error);
//     response.status(500).send('Sorry. Something went wrong!')
//   });
// }  

app.listen(PORT, () => console.log(`Server up on ${PORT}`));
