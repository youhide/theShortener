[![CI](https://github.com/youhide/theShortener/actions/workflows/ci.yml/badge.svg)](https://github.com/youhide/theShortener/actions/workflows/ci.yml) [![NPM Publish](https://github.com/youhide/theShortener/actions/workflows/publish.yml/badge.svg)](https://github.com/youhide/theShortener/actions/workflows/publish.yml)

# theShortener

A fast string shortener that generates short codes using SHA-256 and Base62 encoding, implemented as a native Node.js addon in C++.

## Features
- Fast native C++ implementation (N-API)
- Configurable output length (1-22 characters, default 8)
- Async support (`genAsync`) for non-blocking operation
- Prebuilt binaries for major platforms (no compiler needed)
- Cryptographically secure using SHA-256
- Base62 encoding (0-9, A-Z, a-z)
- Deterministic results - same input always produces same output
- ESM and CommonJS support
- CLI included

## Installation
```bash
npm install theshortener
```

Prebuilt binaries are included for Linux, macOS, and Windows. Falls back to compiling from source if no prebuild is available (requires C++ compiler + OpenSSL dev libraries).

## Usage

### CommonJS
```javascript
const shortener = require('theshortener');

const code = shortener.gen('https://google.com');
console.log(code); // "Qhq1TQ2n"

// Custom length (1-22)
const short = shortener.gen('https://google.com', 6);
console.log(short); // "Qhq1TQ"
```

### ESM
```javascript
import { gen, genAsync } from 'theshortener';

const code = gen('https://google.com');
```

### Async
```javascript
const { genAsync } = require('theshortener');

const code = await genAsync('https://google.com');
console.log(code); // "Qhq1TQ2n"

// Custom length
const long = await genAsync('https://google.com', 16);
```

### TypeScript
```typescript
import { gen, genAsync } from 'theshortener';

const code: string = gen('https://google.com');
const asyncCode: string = await genAsync('https://google.com', 12);
```

## CLI Usage
### Install globally:
```bash
npm i -g theshortener
```
Use from command line:
```bash
theshortener https://google.com
# Qhq1TQ2n

theshortener --length 12 https://google.com

theshortener --version
theshortener --help
```

## API

### `gen(input: string, length?: number): string`

Generate a short code synchronously.

- **input** — String to shorten (max 64KB)
- **length** — Output length, 1-22 (default: 8)
- **returns** — Alphanumeric string of the specified length
- **throws** — `TypeError` if input is missing, not a string, or empty; `RangeError` if input exceeds 64KB or length is out of range

### `genAsync(input: string, length?: number): Promise<string>`

Same as `gen()` but runs SHA-256 + Base62 encoding in a worker thread.

## Development
#### Prerequisites:

- Node.js >= 20
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

#### Run benchmarks:
```bash
npm run bench
```

## Collision Probability

The default 8-character output uses 64 bits of the SHA-256 hash, providing approximately 47.6 bits of entropy in Base62. By the birthday paradox, you can expect a ~50% collision probability after roughly 2³² (~4.3 billion) unique inputs. For fewer collisions, use a longer output length.

## Notes

- Uses N-API (Node-API) for ABI stability across Node.js versions
- Uses OpenSSL for SHA-256 hashing
- This is a one-way hashing implementation. Reverse lookups (getting original string from short code) require storing input-to-code mappings in a database
- Shorter lengths are prefixes of longer outputs (same input)

## License
MIT
