'use strict';

const superagent = require('superagent');

let cache = require('./cache.js');

const getWeather = async(req, res, next) => {
  try {
    if(req.query.lat === undefined) {
      throw new Error('Latitude not specified in url query.')
    }
    if(req.query.lon === undefined) {
      throw new Error('Longitude not specified in url query.')
    }
    const key = 'weather-' + req.query.lat + req.query.lon;
    const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
    const queryParams = {
      key: process.env.WEATHER_API_KEY,
      lang: 'en',
      lat: req.query.lat,
      lon: req.query.lon,
      days: 5,
    };
    // Cache results for 1/2 hour
    if (cache[key] && (Date.now() - cache[key].timestamp < 108000)) { 
      console.log('Cache hit');
    } else {
      console.log('Cache miss');
      cache[key] = {};
      cache[key].timestamp = Date.now();
      let response = await superagent.get(url).query(queryParams);
      let parsed = await parseWeather(response);
      cache[key].data = parsed;
    }
    res.json(cache[key].data);
  } catch(err) {
    console.log(err);
    next(err);
  }
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.body.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

function Weather(day) {
  this.forecast = day.weather.description;
  this.time = day.datetime;
};

module.exports = getWeather;