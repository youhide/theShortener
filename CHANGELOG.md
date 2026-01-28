# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
