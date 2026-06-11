"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesOrderHeaderService = void 0;
const implementation_1 = require("@/repositories/customer/implementation");
const implementation_2 = require("@/repositories/product/implementation");
const implementation_3 = require("@/services/sales-order-header/implementation");
const implementation_4 = require("@/repositories/sales-order-logs/implementation");
const makeSalesOrderHeaderService = () => {
    const customerRepository = new implementation_1.CustomerRepositoryImpl();
    const productRepository = new implementation_2.ProductRepositoryImpl();
    const salesOrderLogRepository = new implementation_4.SalesOrderLogRepositoryImpl();
    return new implementation_3.SalesOrderHeaderServiceImpl(productRepository, salesOrderLogRepository, customerRepository);
};
exports.salesOrderHeaderService = makeSalesOrderHeaderService();
