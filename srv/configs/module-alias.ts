import { addAlias } from 'module-alias';
import path from 'path';

const src = path.resolve(__dirname, '..'); // aponta para /src
addAlias('@', src);
export {};
