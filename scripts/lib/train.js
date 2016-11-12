const Request = require('request-promise');
const Cheerio = require('cheerio');

const Routes = {
  京王線: 'http://transit.yahoo.co.jp/traininfo/detail/102/0/',
};
const Routing = name => Routes[Object.keys(Routes).find(route => route.includes(name))];

const makeAttachment = (text, url) => [{
  color: 'warning',
  fallback: text,
  title: '運行情報',
  title_link: url,
  text,
}];

module.exports = (routeName, say, cb) => {
  const uri = Routing(routeName);

  if (!uri) {
    cb(say.Train.unknown(routeName));
    return;
  }

  Request
    .get({ uri, transform: body => Cheerio.load(body) })
    .then(($) => {
      const title = $('h1').text();
      const isNormal = $('.icnNormalLarge').length;

      if (isNormal) {
        cb(say.Train.normal(title));
      } else {
        cb(say.Train.delay(title), makeAttachment($('.trouble p').text(), uri));
      }
    })
    .catch(err => cb(err.stack || err));
};
