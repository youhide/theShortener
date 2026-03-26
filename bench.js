const shortener = require('./');

const INPUT = 'https://google.com/search?q=hello+world&lang=en';
const ITERATIONS = 1_000_000;

console.log('theShortener benchmark\n');

// Warm up
for (let i = 0; i < 1000; i++) shortener.gen(INPUT);

// gen() sync benchmark
{
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    shortener.gen(INPUT);
  }
  const elapsed = performance.now() - start;
  const opsPerSec = Math.round(ITERATIONS / (elapsed / 1000));
  console.log(`gen() sync:  ${opsPerSec.toLocaleString()} ops/sec (${ITERATIONS.toLocaleString()} iterations in ${elapsed.toFixed(0)}ms)`);
}

// gen() with custom length
{
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    shortener.gen(INPUT, 12);
  }
  const elapsed = performance.now() - start;
  const opsPerSec = Math.round(ITERATIONS / (elapsed / 1000));
  console.log(`gen(_, 12):  ${opsPerSec.toLocaleString()} ops/sec (${ITERATIONS.toLocaleString()} iterations in ${elapsed.toFixed(0)}ms)`);
}

// genAsync() benchmark
{
  const ASYNC_ITERATIONS = 100_000;
  const start = performance.now();
  const promises = [];
  for (let i = 0; i < ASYNC_ITERATIONS; i++) {
    promises.push(shortener.genAsync(INPUT));
  }
  Promise.all(promises).then(() => {
    const elapsed = performance.now() - start;
    const opsPerSec = Math.round(ASYNC_ITERATIONS / (elapsed / 1000));
    console.log(`genAsync():  ${opsPerSec.toLocaleString()} ops/sec (${ASYNC_ITERATIONS.toLocaleString()} iterations in ${elapsed.toFixed(0)}ms)`);
  });
}
