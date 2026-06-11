"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesReportController = exports.makeSalesReportController = void 0;
const implementation_1 = require("@/controllers/sales-report/implementation");
const sales_report_1 = require("@/factories/services/sales-report");
const makeSalesReportController = () => {
    return new implementation_1.SalesReportControllerImpl(sales_report_1.salesReportService);
};
exports.makeSalesReportController = makeSalesReportController;
exports.salesReportController = (0, exports.makeSalesReportController)();
