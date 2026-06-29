"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderLogModel = void 0;
class SalesOrderLogModel {
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        return new SalesOrderLogModel({
            ...props,
            id: crypto.randomUUID(),
        });
    }
    get id() {
        return this.props.id;
    }
    get headerId() {
        return this.props.headerId;
    }
    get userData() {
        return this.props.userData;
    }
    get orderData() {
        return this.props.orderData;
    }
    toObject() {
        console.log('header_id:', this.headerId);
        return {
            id: this.id,
            header_id: this.headerId,
            userData: this.userData,
            orderData: this.orderData,
        };
    }
}
exports.SalesOrderLogModel = SalesOrderLogModel;
//# sourceMappingURL=sales-order-log.js.map