"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-lines-per-function */
require("../configs/module-alias");
const customers_1 = require("@/factories/controllers/customers");
const sales_order_header_1 = require("@/factories/controllers/sales-order-header");
const sales_report_1 = require("@/factories/controllers/sales-report");
//const { SELECT } = cds.ql;
exports.default = (service) => {
    service.before(['READ', 'WRITE', 'DELETE'], '*', (request) => {
        if (!request.user.is('admin')) {
            return request.reject(403, 'Unauthorized access - admin role required' + request.user);
        }
    });
    service.before('READ', '*', (request) => {
        if (request.user.is('read only') && !request.user.is('admin')) {
            return request.reject(403, 'Unauthorized access - read only role required' + request.user);
        }
    });
    service.after('READ', 'customers', (customerList, request) => {
        //request.results = customerController.afterRead(customerList);
        request.result = customers_1.customerController.afterRead(customerList);
    });
    service.before('CREATE', 'SalesOrdersHeaders', async (request) => {
        const result = await sales_order_header_1.salesOrderHeaderController.beforeCreate(request.data);
        if (result.hasError) {
            return request.reject(400, result.error?.message || 'Error processing sales order header');
        }
        request.data.totalamount = result.totalAmount;
    });
    service.after('CREATE', 'SalesOrdersHeaders', async (salesOrderHeaders, request) => {
        await sales_order_header_1.salesOrderHeaderController.afterCreate(salesOrderHeaders, request.user);
        console.log(request.user);
    });
    service.on('getSalesReportByDays', async (request) => {
        const days = request.data?.days || 7;
        return sales_report_1.salesReportController.findByDays(days);
    });
    service.on('getSalesReportByCustomerId', async (request) => {
        const [{ id: customerId }] = request.params;
        if (!customerId) {
            return request.reject(400, 'Customer ID is required');
        }
        return sales_report_1.salesReportController.findByCustomerId(customerId);
    });
};
