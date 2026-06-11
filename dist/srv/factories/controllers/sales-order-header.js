"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesOrderHeaderController = exports.makeSalesOrderHeaderController = void 0;
const implementation_1 = require("@/controllers/sales-order-header/implementation");
const sales_order_header_1 = require("@/factories/services/sales-order-header");
const makeSalesOrderHeaderController = () => {
    return new implementation_1.SalesOrderHeaderControllerImpl(sales_order_header_1.salesOrderHeaderService);
};
exports.makeSalesOrderHeaderController = makeSalesOrderHeaderController;
exports.salesOrderHeaderController = (0, exports.makeSalesOrderHeaderController)();
