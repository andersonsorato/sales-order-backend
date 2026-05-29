import { CustomerRepositoryImpl } from '@/repositories/customer/implementation';
import { ProductRepositoryImpl } from '@/repositories/product/implementation';
import { SalesOrderHeaderServiceImpl } from '@/services/sales-order-header/implementation';
import { SalesOrderLogRepositoryImpl } from '@/repositories/sales-order-logs/implementation';
import {} from '@/services/sales-order-header/protocols';

const makeSalesOrderHeaderService = (): SalesOrderHeaderServiceImpl => {
    const customerRepository = new CustomerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    const salesOrderLogRepository = new SalesOrderLogRepositoryImpl();
    return new SalesOrderHeaderServiceImpl(productRepository, salesOrderLogRepository, customerRepository);
};

export const salesOrderHeaderService = makeSalesOrderHeaderService();
