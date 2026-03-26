#!/usr/bin/env node
const shortener = require('./');

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log('Usage: theshortener [options] <string>');
    console.log('\nGenerate a short code from any string using SHA-256 + Base62');
    console.log('\nOptions:');
    console.log('  -l, --length <n>  Output length (1-22, default: 8)');
    console.log('  -v, --version     Show version');
    console.log('  -h, --help        Show help');
    console.log('\nExamples:');
    console.log('  theshortener https://google.com');
    console.log('  theshortener --length 12 https://google.com');
    process.exit(args.length === 0 ? 1 : 0);
}

if (args.includes('--version') || args.includes('-v')) {
    console.log(require('./package.json').version);
    process.exit(0);
}

let length;
let input;

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--length' || args[i] === '-l') {
        length = parseInt(args[++i], 10);
        if (isNaN(length)) {
            console.error('Error: --length requires a numeric value');
            process.exit(1);
        }
    } else {
        input = args[i];
    }
}

if (!input) {
    console.error('Error: no input string provided');
    process.exit(1);
}

try {
    const result = length != null ? shortener.gen(input, length) : shortener.gen(input);
    console.log(result);
} catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
}
