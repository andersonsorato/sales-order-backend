export type ProductProps = {
    id: string;
    name: string;
    price: number;
    stock: number;
}

export type SellValidationResult = {
    hasError: boolean;
    error?: Error; // Optional error message if validation fails
};

export class ProductModel {
    constructor(private props: ProductProps){}

    public static whit(props: ProductProps): ProductModel {
        return new ProductModel(props);
    }

    public get id(){
        return this.props.id;
    }
    public get name(){
        return this.props.name;
    }
    public get price(){
        return this.props.price;
    }
    public get stock(){
        return this.props.stock;
    }

    public set stock(stock: number) {
        this.props.stock = stock;
    }

    public sell(amount: number): SellValidationResult {
        if (this.stock < amount) {
            return {
                hasError: true,
                error: new Error(`Saldo insulficiente no estoque ${this.name}. Available stock: ${this.stock}, requested: ${amount}`)
            };
        }
        this.stock -= amount;
        return { hasError: false };
            };
        }
    

