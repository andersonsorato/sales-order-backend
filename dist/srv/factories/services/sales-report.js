"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesReportService = void 0;
const implementation_1 = require("@/repositories/sales-report/implementation");
const implementation_2 = require("@/services/sales-report/implementation");
const makeSalesReportService = () => {
    const repository = new implementation_1.SalesReportRepositoryImpl();
    return new implementation_2.SalesReportServiceImpl(repository);
};
exports.salesReportService = makeSalesReportService();
