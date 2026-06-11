"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = void 0;
const implementation_1 = require("@/controllers/customers/implementation");
const customers_1 = require("@/factories/services/customers");
const makeCustomerController = () => {
    return new implementation_1.CustomerControllerImpl(customers_1.customerService);
};
exports.customerController = makeCustomerController();
