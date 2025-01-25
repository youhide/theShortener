#!/usr/bin/env node
const shortener = require('./');

console.log(shortener.gen(process.argv[2]));
