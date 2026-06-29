"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesOrderHeaderService = void 0;
const implementation_1 = require("@/repositories/customer/implementation");
const implementation_2 = require("@/repositories/product/implementation");
const implementation_3 = require("@/repositories/sales-order-header/implementation");
const implementation_4 = require("@/services/sales-order-header/implementation");
const implementation_5 = require("@/repositories/sales-order-logs/implementation");
const makeSalesOrderHeaderService = () => {
    const customerRepository = new implementation_1.CustomerRepositoryImpl();
    const productRepository = new implementation_2.ProductRepositoryImpl();
    const salesOrderLogRepository = new implementation_5.SalesOrderLogRepositoryImpl();
    const salesOrderHeaderRepository = new implementation_3.SalesOrderheaderRepositoryImpl();
    return new implementation_4.SalesOrderHeaderServiceImpl(productRepository, salesOrderLogRepository, customerRepository, salesOrderHeaderRepository);
};
exports.salesOrderHeaderService = makeSalesOrderHeaderService();
//# sourceMappingURL=sales-order-header.js.map