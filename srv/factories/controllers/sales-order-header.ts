import { SalesOrderHeaderController } from "srv/controllers/sales-order-header/protocols";
import { salesOrderHeaderService } from "../services/sales-order-header";
import { SalesOrderHeaderControllerImpl } from "srv/controllers/sales-order-header/implementation";

export const makeSalesOrderHeaderController = (): SalesOrderHeaderController => {
    return new SalesOrderHeaderControllerImpl(salesOrderHeaderService);
}
export const salesOrderHeaderController = makeSalesOrderHeaderController();