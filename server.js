'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

const errorHandler = require('./handlers/error');
const getMovies = require('./handlers/movies');
const getWeather = require('./handlers/weather');
const getYelp = require('./handlers/yelp');

const app = express();
const PORT = process.env.PORT || 3001

// Cors Fix
app.use(cors());

// Error Handling
app.use(errorHandler)

// Server Routes
app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.get('/weather', getWeather);

app.get('/movies', getMovies);

app.get('/yelp', getYelp);

// Listen on Port
app.listen(PORT, () => console.log(`Server up on ${PORT}`));
