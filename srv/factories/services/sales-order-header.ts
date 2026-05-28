import { CustomerRepositoryImpl } from 'srv/repositories/customer/implementation';
import { ProductRepositoryImpl } from 'srv/repositories/product/implementation';
import { SalesOrderHeaderServiceImpl } from 'srv/services/sales-order-header/implementation';
import { SalesOrderLogRepositoryImpl } from 'srv/repositories/sales-order-logs/implementation';
import {} from 'srv/services/sales-order-header/protocols';

const makeSalesOrderHeaderService = (): SalesOrderHeaderServiceImpl => {
    const customerRepository = new CustomerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    const salesOrderLogRepository = new SalesOrderLogRepositoryImpl();
    return new SalesOrderHeaderServiceImpl(productRepository, salesOrderLogRepository, customerRepository);
};

export const salesOrderHeaderService = makeSalesOrderHeaderService();
