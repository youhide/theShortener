var shortener = require('./shortener');

exports.gen = function(url) {
  if(typeof url === 'undefined') return 0;
  return shortener.gen(url);
}
