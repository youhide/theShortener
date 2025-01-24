const test = require('ava');
const shortener = require('./');

const TEST_URLS = [
    'google.com',
    'https://example.com',
    'https://test.com/path/to/something',
    'https://special-chars.com/!@#$%^&*()',
    'localhost:3000',
    'very.very.long.domain.with.subdomain.example.com',
    'http://user:pass@domain.com',
    'https://domain.com/?query=123&param=456'
];

test('URL shortening basic tests', t => {
    for (const url of TEST_URLS) {
        const shortened = shortener.gen(url);
        t.is(shortened.length, 8, `Short URL length should be 8 for ${url}`);
        t.regex(shortened, /^[0-9A-Za-z]+$/, `Output should be alphanumeric for ${url}`);
    }
});

test('Consistency test', t => {
    for (const url of TEST_URLS) {
        const first = shortener.gen(url);
        const second = shortener.gen(url);
        t.is(first, second, `Same URL should generate same code: ${url}`);
    }
});

test('Uniqueness test', t => {
    const results = new Set();
    for (const url of TEST_URLS) {
        const shortened = shortener.gen(url);
        t.false(results.has(shortened), `Generated code should be unique: ${shortened} for ${url}`);
        results.add(shortened);
    }
});

test('Error cases', t => {
  // Test missing arguments
  const error1 = t.throws(
      () => shortener.gen(),
      { instanceOf: TypeError, message: 'Wrong number of arguments' }
  );

  // Test empty string
  const error2 = t.throws(
      () => shortener.gen(''),
      { instanceOf: TypeError, message: 'Invalid URL' }
  );
});
