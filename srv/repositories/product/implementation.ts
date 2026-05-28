import { ProductRepository } from './protocols';
import { ProductModel, ProductProps } from 'srv/models/product';

import cds from '@sap/cds';

import {} from '@cds-models/sales';

const { SELECT } = cds.ql;

export class ProductRepositoryImpl implements ProductRepository {
    public async findByIds(ids: ProductProps['id'][]): Promise<ProductModel[] | null> {
        // Implement the logic to fetch products by their IDs from the database
        // This is a placeholder implementation and should be replaced with actual database queries
        const productQuery = SELECT.from('sales.products').where({ id: ids });
        const dbProducts = await cds.run(productQuery);

        // const products = await this.fetchProductsFromDatabase(ids);
        if (!dbProducts || dbProducts.length === 0) {
            return null;
        }

        return dbProducts.map(
            (product) =>
                new ProductModel({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                }),
        );
    }

    private async fetchProductsFromDatabase(): Promise<unknown[]> {
        // Placeholder for database fetching logic
        // Replace this with actual database access code
        return [];
    }
    public async updateStock(product: ProductModel): Promise<void> {
        // Implement the logic to update the stock of a product in the database
        // This is a placeholder implementation and should be replaced with actual database queries
        await cds.update('sales.products').set({ stock: product.stock }).where({ id: product.id });
    }
}
