"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesReportModel = void 0;
class SalesReportModel {
    constructor(props) {
        this.props = props;
    }
    static with(props) {
        return new SalesReportModel(props);
    }
    get salesOrderId() {
        return this.props.salesOrderId;
    }
    get SalesOrderTotalAmount() {
        return this.props.SalesOrderTotalAmount;
    }
    get customerId() {
        return this.props.customerId;
    }
    get customerFullName() {
        return this.props.customerFullName;
    }
    toObject() {
        return {
            salesOrderId: this.props.salesOrderId,
            SalesOrderTotalAmount: this.props.SalesOrderTotalAmount,
            customerId: this.props.customerId,
            customerFullName: this.props.customerFullName,
        };
    }
}
exports.SalesReportModel = SalesReportModel;
//# sourceMappingURL=sales-report.js.map