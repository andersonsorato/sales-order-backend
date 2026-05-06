import { ProductModel, ProductProps } from "srv/models/product";
import { ProductRepository } from "./protocols";
import cds from "@sap/cds";
import { products } from "@cds-models/sales";

const { SELECT } = cds.ql;

export class ProductRepositoryImpl implements ProductRepository {
    public async findByIds(ids: ProductProps["id"][]): Promise<ProductModel | null> {
        // Implement the logic to fetch products by their IDs from the database
        // This is a placeholder implementation and should be replaced with actual database queries
        const productQuery = SELECT.from('sales.products').where({ id: ids });
        const dbProducts = await cds.run(productQuery); 

       // const products = await this.fetchProductsFromDatabase(ids);
        if (!dbProducts || dbProducts.length === 0) {
            return null;
        }

        return dbProducts.map(product => new ProductModel({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock
        }));
    }

    private async fetchProductsFromDatabase(ids: ProductProps["id"][]): Promise<any[]> {
        // Placeholder for database fetching logic
        // Replace this with actual database access code
        return [];
    }
}   