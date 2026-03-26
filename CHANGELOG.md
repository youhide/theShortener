# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-03-26

### Added
- `genAsync(input, length?)` — async version using worker threads for non-blocking operation
- Configurable output length: `gen(input, length?)` with length 1-22 (default: 8)
- ESM support via `index.mjs` and `"exports"` field in package.json
- Prebuilt binaries via `prebuildify` — no compiler needed on most platforms
- Input type validation — non-string arguments now throw `TypeError`
- Input size limit (64KB) — oversized inputs throw `RangeError`
- OpenSSL error checking — all EVP API return values are validated
- Multi-platform CI testing (Linux, macOS, Windows)
- CLI `--length` / `-l` option for custom output length
- CLI `--version` / `-v` flag
- `.editorconfig` and ESLint configuration
- Benchmark script (`npm run bench`)
- Collision probability documentation in README

### Changed
- Migrated from `nan` to `node-addon-api` (N-API) for ABI stability across Node.js versions
- `install` script now uses `node-gyp-build` (tries prebuilt first, falls back to compile)
- Entry point changed from `./build/Release/shortener.node` to `./index.js` (JS wrapper)
- Performance: eliminated intermediate hex string conversion in SHA-256 → Base62 pipeline
- Performance: optimized Base62 encoding (reverse-build instead of O(n²) prepend)
- CI now tests Node.js 20, 22, 24 across Linux, macOS, and Windows
- Publish workflow now builds prebuilt binaries before publishing
- Updated Windows OpenSSL library reference

### Removed
- Removed `nan` dependency (replaced by `node-addon-api`)

## [1.1.0] - 2026-01-27

### Added
- TypeScript type definitions (`index.d.ts`) for better IDE support
- CLI help command (`--help` / `-h`)
- Error handling in CLI for missing arguments
- MIT license file
- Auto-build on `npm install` via `install` script

### Changed
- Updated SHA-256 implementation from deprecated `SHA256_*` API to modern `EVP_*` API (OpenSSL 3.0+ compatible)
- Updated `nan` dependency for Node.js 25 compatibility
- Fixed `binding.gyp` to include OpenSSL paths for macOS (Homebrew)
- Updated license in README from "DY - Dunno Yet" to MIT

### Removed
- Removed redundant `run.js` file (use CLI instead)

## [1.0.21] - Previous

- Initial stable release
- SHA-256 + Base62 encoding
- 8-character deterministic output
- Native C++ addon via nan
