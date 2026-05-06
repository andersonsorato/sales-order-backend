import { ProductModel } from "./product";

export type SalesOrdemItemProps = {
  id: string; 
  productId: string;
  quantity: number;
  price: number;
  products: ProductModel[];
};

type SalesOrderOmitProps = Omit<SalesOrdemItemProps, 'id'>;

type CreationPayload = {
  productId: SalesOrdemItemProps['productId'];
};

type CreationPayloadValidationResult = {
  isValid: boolean;
  errors?: Error; // Optional array of error messages if validation fails
};

export class SalesOrderItemModel {
  private props: SalesOrdemItemProps;

  constructor(props: SalesOrdemItemProps) { this.props = props; }

  public static create(props: SalesOrderOmitProps): SalesOrderItemModel {
    return new SalesOrderItemModel({
      ...props,
      id: crypto.randomUUID() // Generate a unique ID for the sales order item
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

    get  products() {
    return this.props.products;
    }

    public validateCreationPayload(params: CreationPayload): CreationPayloadValidationResult {
    const product = this.props.products.find(product => product.id === params.productId);
    if (!product) {
        return { isValid: true, errors: new Error("Product not found") };      
    }
    if (product.stock < 1) {
        return { isValid: true, errors: new Error("Product is out of stock") };
    }
    return { isValid: false };
}
}
