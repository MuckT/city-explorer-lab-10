'use strict';

const superagent = require('superagent');

let cache = require('./cache.js');

const getYelp = async(req, res, next) => {
  try{
    if(req.query.location === undefined) {
      throw new Error('Search location not specified.');
    }
    const key = 'yelp-' + req.query.location;
    const url = 'https://api.yelp.com/v3/businesses/search';
    const headers = {
      Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      Accept: 'application/json'
    };
    const queryParams = {
      location: req.query.location,
      term: 'restaurants',
      limit: 5
    };
    // Cache results for 1 Day
    if (cache[key] && (Date.now() - cache[key].timestamp < 8640000)) { 
      console.log('Cache hit');
    } else {
      console.log('Cache miss');
      cache[key] = {};
      cache[key].timestamp = Date.now();
      let yelpResponse = await superagent.get(url).set(headers).query(queryParams);
      let yelp = await parseYelp(yelpResponse);
      cache[key].data = yelp;
    }
    res.json(cache[key].data);
  } catch(err) {
    next(err);
  }
}

// Yelp Parser
function parseYelp(yelpData) {
  try {
    const businessSummary = yelpData.body.businesses.map(business => {
      return new Business(business);
    });
    return Promise.resolve(businessSummary);
  } catch (e) {
    return Promise.reject(e);
  }
}

//TODO: Create Yelp Constructor
function Business(yelp) {
  this.name = yelp.name;
  this.price = yelp.price;
  this.rating = yelp.rating;
  this.url = yelp.url;
};

module.exports = getYelp;
