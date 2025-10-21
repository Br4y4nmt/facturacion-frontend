// ESM wrapper that forwards to the CommonJS config in tailwind.config.cjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const config = require('./tailwind.config.cjs');
export default config;
