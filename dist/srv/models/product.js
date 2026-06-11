"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
class ProductModel {
    constructor(props) {
        this.props = props;
    }
    static whit(props) {
        return new ProductModel(props);
    }
    get id() {
        return this.props.id;
    }
    get name() {
        return this.props.name;
    }
    get price() {
        return this.props.price;
    }
    get stock() {
        return this.props.stock;
    }
    set stock(stock) {
        this.props.stock = stock;
    }
    sell(amount) {
        if (this.stock < amount) {
            return {
                hasError: true,
                error: new Error(`Saldo insulficiente no estoque ${this.name}. Available stock: ${this.stock}, requested: ${amount}`),
            };
        }
        this.stock -= amount;
        return { hasError: false };
    }
}
exports.ProductModel = ProductModel;
