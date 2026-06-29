"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderHeaderModel = void 0;
class SalesOrderHeaderModel {
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        return new SalesOrderHeaderModel({
            ...props,
            id: crypto.randomUUID(), // Generate a unique ID for the sales order header
            totalAmount: 0, // Initialize totalAmount to 0
        });
    }
    get id() {
        return this.props.id;
    }
    get customerId() {
        return this.props.customerId;
    }
    get totalAmount() {
        return this.props.totalAmount;
    }
    get items() {
        return this.props.items;
    }
    set totalAmount(amount) {
        this.props.totalAmount = amount;
    }
    validateCreationPayload(params) {
        if (!params.customer_Id) {
            return { isValid: true, errors: new Error('Customer ID is required') };
        }
        if (!this.items || this.items.length === 0) {
            return { isValid: true, errors: new Error('At least one item is required') };
        }
        const itemsErros = [];
        this.items.forEach((item) => {
            const validationResult = item.validateCreationPayload({ productId: item.productId });
            if (validationResult.isValid) {
                itemsErros.push(validationResult.errors?.message);
            }
        });
        if (itemsErros.length > 0) {
            const messages = itemsErros.join('\n -');
            return { isValid: true, errors: new Error(messages) };
        }
        return { isValid: false };
    }
    calculateTotalAmount() {
        let totalAmount = 0;
        this.items.forEach((item) => {
            totalAmount += item.price * item.quantity;
        });
        return totalAmount;
    }
    calculateDiscount() {
        const totalAmount = this.calculateTotalAmount();
        if (totalAmount > 1000) {
            return totalAmount * 0.1; // 10% discount for orders above $1000
        }
        return 0;
    }
    getProductsData() {
        return this.items.map((item) => ({
            id: item.productId,
            quantity: item.quantity,
        }));
    }
    toStringfieObject() {
        return JSON.stringify(this.props);
    }
    toCreateonObject() {
        return {
            id: this.props.id,
            customer_Id: this.props.customerId,
            totalAmount: this.calculateTotalAmount(),
            items: this.props.items,
        };
    }
}
exports.SalesOrderHeaderModel = SalesOrderHeaderModel;
//# sourceMappingURL=sales-order-header.js.map