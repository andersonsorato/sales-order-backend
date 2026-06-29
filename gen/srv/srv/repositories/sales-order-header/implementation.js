"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderheaderRepositoryImpl = void 0;
/* eslint-disable max-lines-per-function */
const cds_1 = __importDefault(require("@sap/cds"));
const product_1 = require("@/models/product");
const sales_order_header_1 = require("@/models/sales-order-header");
const sales_order_item_1 = require("@/models/sales-order-item");
const { SELECT } = cds_1.default.ql;
class SalesOrderheaderRepositoryImpl {
    async bulkCreate(headers) {
        const headerObjects = headers.map((header) => header.toCreateonObject());
        await cds_1.default.create('sales.SalesOrderHeaders').entries(headerObjects);
    }
    async findCompleteSalesOrderById(id) {
        const sql = SELECT.from('sales.SalesOrderHeaders')
            .columns('totalamount', 'customers.id as customerId', 'items.quantity as item_quantity', 'items.price as item_price', 'items.products as products_Id', 'items.products.price as product_price', 'items.products.stock as product_stock')
            .where({ id });
        const headers = await cds_1.default.run(sql);
        if (!headers || headers.length === 0) {
            return null;
        }
        const products = headers.map((header) => product_1.ProductModel.whit({
            id: header.product_id,
            name: header.product_name,
            price: header.product_price,
            stock: header.product_stock,
        }));
        const items = headers.map((header) => sales_order_item_1.SalesOrderItemModel.create({
            price: header.item_price,
            quantity: header.item_quantity,
            productId: header.product_id,
            products,
        }));
        return sales_order_header_1.SalesOrderHeaderModel.create({
            customerId: headers.at(0)?.customerId,
            items,
        });
    }
}
exports.SalesOrderheaderRepositoryImpl = SalesOrderheaderRepositoryImpl;
//# sourceMappingURL=implementation.js.map