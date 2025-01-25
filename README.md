[![CI](https://github.com/youhide/theShortener/actions/workflows/ci.yml/badge.svg)](https://github.com/youhide/theShortener/actions/workflows/ci.yml) [![NPM Publish](https://github.com/youhide/theShortener/actions/workflows/publish.yml/badge.svg)](https://github.com/youhide/theShortener/actions/workflows/publish.yml)

# theShortener

A fast string shortener that generates 8-character codes using SHA-256 and Base62 encoding, implemented as a native Node.js addon in C++.

## Features
- Fast native C++ implementation
- Consistent 8-character outputs
- Cryptographically secure using SHA-256
- Base62 encoding (0-9, a-z, A-Z)
- Deterministic results - same input produces same output

## Installation
```bash
npm install theshortener --save
```

## Usage
```javascript
const shortener = require('theshortener');

// Generate short code
const shortCode = shortener.gen('https://google.com');
console.log(shortCode); // Outputs: "Qhq1TQ2n"
```

## CLI Usage
### Install globally:
```bash
npm install theshortener --save
```
Use from command line:
```bash
theshortener https://google.com
Qhq1TQ2n
```

## Development
#### Prerequisites:

- Node.js
- C++ compiler
- OpenSSL development libraries

#### Build from source:
```bash
npm run build
```

#### Run tests:
```bash
npm test
```

## Notes

- Currently in BETA - not recommended for production use
- The output is always 8 characters long
- Uses OpenSSL for SHA-256 hashing
- This is a one-way hashing implementation. Reverse lookups (getting original STR from short code) require storing STR-to-hash mappings in a database.

## License
DY - Dunno Yet
