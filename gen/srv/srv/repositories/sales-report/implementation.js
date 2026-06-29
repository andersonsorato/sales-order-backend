"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesReportRepositoryImpl = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const sales_report_1 = require("@/models/sales-report");
const { SELECT } = cds_1.default.ql;
class SalesReportRepositoryImpl {
    async findByDays(days) {
        const today = new Date().toISOString();
        const subtractedDays = new Date();
        subtractedDays.setDate(subtractedDays.getDate() - days);
        const subtractedDaysISOString = subtractedDays.toISOString();
        console.log('Today:', today);
        console.log(`Subtracted ${days} days:`, subtractedDaysISOString);
        const sql = SELECT.from('sales.SalesOrderHeaders')
            .columns('id as salesOrderId', 'totalamount as SalesOrderTotalAmount', 'customers_id as customerId', 
        // eslint-disable-next-line quotes
        `customers.firstName || ' ' || 'nao adicionei' as customerFullName`)
            .where({ createdAt: { between: subtractedDaysISOString, and: today } });
        const salesReports = await cds_1.default.run(sql);
        if (salesReports.length === 0) {
            return null;
        }
        return salesReports.map((_salesReport) => new sales_report_1.SalesReportModel({
            salesOrderId: _salesReport.salesOrderId,
            SalesOrderTotalAmount: _salesReport.SalesOrderTotalAmount,
            customerId: _salesReport.customerId,
            customerFullName: _salesReport.customerFullName,
        }));
    }
    async findByCustomerId(customerId) {
        const sql = SELECT.from('sales.SalesOrderHeaders')
            .columns('id as salesOrderId', 'totalamount as SalesOrderTotalAmount', 'customers_id as customerId', 
        // eslint-disable-next-line quotes
        `customers.firstName || ' ' || 'nao adicionei' as customerFullName`)
            .where({ customers_id: customerId });
        const salesReports = await cds_1.default.run(sql);
        if (salesReports.length === 0) {
            return null;
        }
        return salesReports.map((_salesReport) => new sales_report_1.SalesReportModel({
            salesOrderId: _salesReport.salesOrderId,
            SalesOrderTotalAmount: _salesReport.SalesOrderTotalAmount,
            customerId: _salesReport.customerId,
            customerFullName: _salesReport.customerFullName,
        }));
    }
}
exports.SalesReportRepositoryImpl = SalesReportRepositoryImpl;
//# sourceMappingURL=implementation.js.map