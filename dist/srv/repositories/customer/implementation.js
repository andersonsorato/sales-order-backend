"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepositoryImpl = void 0;
const customer_1 = require("@/models/customer");
const cds_1 = __importDefault(require("@sap/cds"));
const { SELECT } = cds_1.default.ql;
class CustomerRepositoryImpl {
    async findById(id) {
        const customerQuery = SELECT.one.from('sales.customers').where({ id });
        const dbCustomer = await cds_1.default.run(customerQuery);
        if (!dbCustomer) {
            return null;
        }
        return customer_1.CustomerModel.whit({
            id: dbCustomer.id,
            firstName: dbCustomer.firstName,
            lastName: dbCustomer.lastName ?? '',
            email: dbCustomer.email,
        });
    }
}
exports.CustomerRepositoryImpl = CustomerRepositoryImpl;
