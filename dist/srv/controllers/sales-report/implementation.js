"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesReportControllerImpl = void 0;
class SalesReportControllerImpl {
    constructor(service) {
        this.service = service;
    }
    async findByDays(days) {
        return await this.service.findByDays(days);
    }
    async findByCustomerId(customerId) {
        return await this.service.findByCustomerId(customerId);
    }
}
exports.SalesReportControllerImpl = SalesReportControllerImpl;
