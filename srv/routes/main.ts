/* eslint-disable max-lines-per-function */
import '../configs/module-alias';

import { FullRequestParams } from '@/routes/protocols';

import { customerController } from '@/factories/controllers/customers';
import { salesOrderHeaderController } from '@/factories/controllers/sales-order-header';
import { salesReportController } from '@/factories/controllers/sales-report';
import { Request, Service } from '@sap/cds';
import { SalesOrderHeaders, customers } from '@cds-models/sales';
import {} from 'node:console';

//const { SELECT } = cds.ql;

export default (service: Service) => {
    service.before(['CREATE', 'UPDATE', 'DELETE'], '*', (request: Request) => {
        if (!request.user.is('admin') && !request.user.is('technical_admin')) {
            return request.reject(403, `Unauthorized access - admin role required: ${request.user?.id}`);
        }
    });
    service.before('READ', '*', (request: Request) => {
        if (request.user.is('read only') && !request.user.is('admin')) {
            return request.reject(403, 'msg de acesso - read only role required ' + request.user?.id);
        }
    });
    service.after('READ', 'customers', (customerList: customers, request) => {
        //request.results = customerController.afterRead(customerList);
        const result = customerController.afterRead(customerList);
        if (result.status >= 400) {
            return request.error(result.status, result.data as string);
        }
        (request as unknown as FullRequestParams<customers>).result = result.data as customers;
    });
    service.before('CREATE', 'SalesOrdersHeaders', async (request: Request) => {
        const result = await salesOrderHeaderController.beforeCreate(request.data);
        if (result.hasError) {
            return request.reject(400, result.error?.message || 'Error processing sales order header');
        }
        request.data.totalamount = result.totalAmount;
    });
    service.after('CREATE', 'SalesOrdersHeaders', async (salesOrderHeaders: SalesOrderHeaders, request: Request) => {
        await salesOrderHeaderController.afterCreate(salesOrderHeaders, request.user);
        console.log(request.user);
    });

    service.on('getSalesReportByDays', async (request: Request) => {
        const days = request.data?.days || 7;
        const result = await salesReportController.findByDays(days);
        if (result.status >= 400) {
            return request.error(result.status, result.data as string);
        }
        return result.data;
    });
    service.on('getSalesReportByCustomerId', async (request: Request) => {
        const [{ id: customerId }] = request.params as unknown as { id: string }[];
        if (!customerId) {
            return request.reject(400, 'Customer ID is required');
        }
        return salesReportController.findByCustomerId(customerId);
    });

    service.on('bulkCreateSalesOrders', async (request: Request) => {
        const payload = request.data?.payload;
        if (!Array.isArray(payload) || payload.length === 0) {
            return request.reject(400, 'Payload is required for bulkCreateSalesOrders');
        }

        return salesOrderHeaderController.bulkCreate(payload, request.user);
    });
    service.on('cloneSalesOrder', async (request: Request) => {
        const [{ id }] = request.params as unknown as { id: string }[];
        const { user } = request;
        return salesOrderHeaderController.cloneSalesOrder(id, user);
    });
};
