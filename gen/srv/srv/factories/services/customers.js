"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerService = void 0;
const implementation_1 = require("@/services/customer/implementation");
const makeCustomerService = () => {
    return new implementation_1.CustomerServiceImpl();
};
exports.customerService = makeCustomerService();
//# sourceMappingURL=customers.js.map