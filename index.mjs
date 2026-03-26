import { createRequire } from 'module';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const addon = require('node-gyp-build')(__dirname);

export default addon;
export const { gen, genAsync } = addon;
