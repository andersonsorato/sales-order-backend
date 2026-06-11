"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderItemModel = void 0;
class SalesOrderItemModel {
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        return new SalesOrderItemModel({
            ...props,
            id: crypto.randomUUID(), // Generate a unique ID for the sales order item
        });
    }
    get id() {
        return this.props.id;
    }
    get productId() {
        return this.props.productId;
    }
    get quantity() {
        return this.props.quantity;
    }
    get price() {
        return this.props.price;
    }
    get products() {
        return this.props.products;
    }
    validateCreationPayload(params) {
        const product = this.props.products.find((product) => product.id === params.productId);
        if (!product) {
            return { isValid: true, errors: new Error('Product not found') };
        }
        if (product.stock < 1) {
            return { isValid: true, errors: new Error('Product is out of stock') };
        }
        return { isValid: false };
    }
}
exports.SalesOrderItemModel = SalesOrderItemModel;
