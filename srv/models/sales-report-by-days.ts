export type SalesReportProps = {
    salesOrderId: string;
    SalesOrderTotalAmount: number;
    customerId: string;
    customerFullName: string;
};

// Alias para compatibilidade com imports que esperam `ExpectedResult`
export type ExpectedResult = SalesReportProps;

export class SalesReportModel {
    constructor(private props: SalesReportProps) {}

    public static with(props: SalesReportProps): SalesReportModel {
        return new SalesReportModel(props);
    }

    public get salesOrderId() {
        return this.props.salesOrderId;
    }

    public get SalesOrderTotalAmount() {
        return this.props.SalesOrderTotalAmount;
    }

    public get customerId() {
        return this.props.customerId;
    }

    public get customerFullName() {
        return this.props.customerFullName;
    }

    public toObject(): SalesReportProps {
        return {
            salesOrderId: this.props.salesOrderId,
            SalesOrderTotalAmount: this.props.SalesOrderTotalAmount,
            customerId: this.props.customerId,
            customerFullName: this.props.customerFullName,
        };
    }
}
