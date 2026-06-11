"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderLogRepositoryImpl = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
class SalesOrderLogRepositoryImpl {
    async create(logs) {
        const logObjects = logs.map((log) => log.toObject());
        await cds_1.default.create('sales.SalesOrderLog').entries(logObjects);
    }
}
exports.SalesOrderLogRepositoryImpl = SalesOrderLogRepositoryImpl;
