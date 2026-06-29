"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesReportServiceImpl = void 0;
class SalesReportServiceImpl {
    constructor(repository) {
        this.repository = repository;
    }
    async findByDays(days) {
        const reportData = await this.repository.findByDays(days);
        if (!reportData) {
            return [];
        }
        return reportData?.map((data) => data.toObject());
    }
    async findByCustomerId(customerId) {
        const reportData = await this.repository.findByCustomerId(customerId);
        if (!reportData) {
            return [];
        }
        return reportData?.map((data) => data.toObject());
    }
}
exports.SalesReportServiceImpl = SalesReportServiceImpl;
//# sourceMappingURL=implementation.js.map