const Forecast = require('weather-yahoo-jp').forecast;

module.exports = (city, say, cb) => {
  Forecast
    .get(city)
    .then(data => cb(say.Forecast.announce(city, data.today)))
    .catch(err => cb(err.stack || err));
};
