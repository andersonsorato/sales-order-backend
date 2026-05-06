import { CustomerModel, CustomerProps } from "srv/models/customer";
import { CustomerRepository } from "./protocols";
import cds from "@sap/cds";

const { SELECT } = cds.ql;

export class CustomerRepositoryImpl implements CustomerRepository {
    public async findById(id: CustomerProps["id"]): Promise<CustomerModel> | null {
        const customerQuery = SELECT.one.from('sales.customers').where({ id });
        const dbCustomer = await cds.run(customerQuery);
        if (!dbCustomer) { 
            return null; 
        }          
            return CustomerModel.whit({
                id: dbCustomer.id,
                firstName: dbCustomer.firstName,
                lastName: dbCustomer.lastName,
                email: dbCustomer.email
            });        
    }
}