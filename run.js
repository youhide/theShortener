const shortener = require('./');

if (process.argv.length !== 3) {
    console.log("Usage: node test.js <url>");
    process.exit(1);
}

const url = process.argv[2];
try {
    const result = shortener.gen(url);
    console.log(`Original URL: ${url}`);
    console.log(`Shortened: ${result}`);
} catch (err) {
    console.error("Error:", err.message);
}
