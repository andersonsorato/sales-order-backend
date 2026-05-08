import { CustomerRepositoryImpl } from "srv/repositories/customer/implementation";
import { ProductRepositoryImpl } from "srv/repositories/product/implementation";
import { SalesOrderLogRepositoryImpl } from "srv/repositories/sales-order-logs/implementation";
import { SalesOrderHeaderServiceImpl } from "srv/services/sales-order-header/implementation";
import { SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";

const makeSalesOrderHeaderService = (): SalesOrderHeaderService => {
  const customerRepository = new CustomerRepositoryImpl();
  const productRepository = new ProductRepositoryImpl();
  const SalesOrderLogRepository = new SalesOrderLogRepositoryImpl();
  return new SalesOrderHeaderServiceImpl(productRepository, SalesOrderLogRepository, customerRepository);
}   

export const salesOrderHeaderService = makeSalesOrderHeaderService();