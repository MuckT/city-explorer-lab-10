'use strict'

const superagent = require('superagent');

let cache = require('./cache.js');

const getMovies = async(req, res, next) => {
  try{
    if(req.query.location === undefined) {
      throw new Error('Search location not specified.');
    }
    const key = 'movies-' + req.query.location;
    const url = 'https://api.themoviedb.org/3/search/movie?';
    const queryParams = {
      query: req.query.location,
      api_key: process.env.MOVIE_API_KEY
    };
    // Cache results for 1 Day
    if (cache[key] && (Date.now() - cache[key].timestamp < 8640000)) { 
      console.log('Cache hit');
    } else {
      console.log('Cache miss');
      cache[key] = {};
      cache[key].timestamp = Date.now();
      let movieResponse = await superagent.get(url).query(queryParams);
      let movies = await parseMovies(movieResponse);
      cache[key].data = movies;
    }
    res.json(cache[key].data);
  } catch(err) {
    next(err);
  }
}

function parseMovies(movieData) {
  try {
    const movieSummary = movieData.body.results.map(movie => {
      return new Movie(movie);
    });
    return Promise.resolve(movieSummary);
  } catch (e) {
    return Promise.reject(e);
  }
}

function Movie(movie) {
  this.title = movie.title;
  this.overview = movie.overview;
  this.image_url = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  this.released_on = movie.release_date;
}

module.exports = getMovies;