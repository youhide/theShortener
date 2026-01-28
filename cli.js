#!/usr/bin/env node
const shortener = require('./');

const input = process.argv[2];

if (!input || input === '--help' || input === '-h') {
    console.log('Usage: theshortener <string>');
    console.log('\nGenerate an 8-character code from any string using SHA-256 + Base62');
    console.log('\nExample:');
    console.log('  theshortener https://google.com');
    console.log('  # Output: Qhq1TQ2n');
    process.exit(input ? 0 : 1);
}

try {
    console.log(shortener.gen(input));
} catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
}
