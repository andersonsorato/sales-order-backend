/* eslint-disable max-lines-per-function */
import cds from '@sap/cds';

import { ProductModel } from '@/models/product';
import { SalesOrderHeaderModel } from '@/models/sales-order-header';
import { SalesOrderItemModel } from '@/models/sales-order-item';
import { CompleteSalesOrderHeader, SalesOrderHeaderRepository } from '@/repositories/sales-order-header/protocols';

const { SELECT } = cds.ql;

export class SalesOrderheaderRepositoryImpl implements SalesOrderHeaderRepository {
    public async bulkCreate(headers: SalesOrderHeaderModel[]): Promise<void> {
        const headerObjects = headers.map((header) => header.toCreateonObject());
        await cds.create('sales.SalesOrderHeaders').entries(headerObjects);
    }

    public async findCompleteSalesOrderById(id: string): Promise<SalesOrderHeaderModel | null> {
        const sql = SELECT.from('sales.SalesOrderHeaders')
            .columns(
                'totalamount',
                'customers.id as customerId',
                'items.quantity as item_quantity',
                'items.price as item_price',
                'items.products as products_Id',
                'items.products.price as product_price',
                'items.products.stock as product_stock',
            )
            .where({ id });
        const headers: CompleteSalesOrderHeader[] = await cds.run(sql);
        if (!headers || headers.length === 0) {
            return null;
        }
        const products: ProductModel[] = headers.map((header) =>
            ProductModel.whit({
                id: header.product_id,
                name: header.product_name,
                price: header.product_price,
                stock: header.product_stock,
            }),
        );
        const items: SalesOrderItemModel[] = headers.map((header) =>
            SalesOrderItemModel.create({
                price: header.item_price,
                quantity: header.item_quantity,
                productId: header.product_id,
                products,
            }),
        );
        return SalesOrderHeaderModel.create({
            customerId: headers.at(0)?.customerId as string,
            items,
        });
    }
}
