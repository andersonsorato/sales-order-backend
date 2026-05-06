import { SalesOrderItemModel } from "./sales-order-item";

type SalesOrderHeaderProps = {
  id: string; 
  customerId: string; 
  totalAmount?: number;
  items: SalesOrderItemModel[]; 
};

type SalesOrderHeaderOmitProps = Omit<SalesOrderHeaderProps, 'id' | 'totalAmount'>;

type CreationPayload = {
  customer_Id: SalesOrderHeaderProps['customerId'];
  items?: any[]; // Define the type for items as needed 
};

type CreationPayloadValidationResult = {
  isValid: boolean;
  errors?: Error; // Optional array of error messages if validation fails
};

export class SalesOrderHeaderModel {
constructor(private props: SalesOrderHeaderProps) { }
  
  public static create(props: SalesOrderHeaderOmitProps): SalesOrderHeaderModel {
    return new SalesOrderHeaderModel({
      ...props,
      id: crypto.randomUUID(), // Generate a unique ID for the sales order header
      totalAmount: 0 // Initialize totalAmount to 0
    });
  }

  
  public get id(){
    return this.props.id;
  }
 public get customerId(){
    return this.props.customerId;
  }

  public get totalAmount(){
    return this.props.totalAmount;
  }

  public get items(){
    return this.props.items;
  }

  public set totalAmount(amount: number) {
    this.props.totalAmount = amount;
  }

public validateCreationPayload(params: CreationPayload): CreationPayloadValidationResult {
    if (!params.customer_Id) {
        return { isValid: true,
                  errors: new Error("Customer ID is required") 
                };
    }
    if (!this.items || this.items.length === 0) {
        return { isValid: true,
                  errors: new Error("At least one item is required") 
                };
    }
    const itemsErros: string[] = [];
    this.items.forEach(item => {
        const validationResult = item.validateCreationPayload({ productId: item.productId });
        if (validationResult.isValid) {
            itemsErros.push(validationResult.errors?.message as string);            
        }   
    });
    if (itemsErros.length > 0) {  
      const messages = itemsErros.join('\n -');
        return { isValid: true, errors: new Error(messages) };
  }
  return { isValid: false };
}  

public calculateTotalAmount(): number {
  let totalAmount = 0;
  this.items.forEach(item => {
    totalAmount += ( item.price as number) * (item.quantity as number);
  });
  return totalAmount;
}
public calculateDiscount(): number{
  let totalAmount = this.calculateTotalAmount();
  if (totalAmount > 1000) {
    return totalAmount * 0.1; // 10% discount for orders above $1000
  }
  return 0;
}
}
