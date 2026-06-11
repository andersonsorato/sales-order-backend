export type ItemsPayload = {
    productId: string;
    quantity: number;
    price: number;
};

export type Payload = {
    customerId: string;
    items: ItemsPayload[];
};

export type payload = Payload;

export type ExpectedResult = {
    success: boolean;
};
