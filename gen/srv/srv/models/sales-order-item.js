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
    toCreateonObject() {
        const product = this.props.products.find((product) => product.id === this.props.productId);
        return {
            id: this.props.id,
            products_id: this.props.productId,
            quantity: this.props.quantity,
            price: this.props.price,
            product: product?.name ?? null,
        };
    }
}
exports.SalesOrderItemModel = SalesOrderItemModel;
//# sourceMappingURL=sales-order-item.js.map