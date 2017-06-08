var shortener = require('./build/Release/shortener');

exports.gen = function(url) {
  if(typeof url === 'undefined') return 0;
  return shortener.id(url);
}
