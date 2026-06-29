"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_alias_1 = require("module-alias");
const path_1 = __importDefault(require("path"));
const src = path_1.default.resolve(__dirname, '..'); // aponta para /src
(0, module_alias_1.addAlias)('@', src);
//# sourceMappingURL=module-alias.js.map