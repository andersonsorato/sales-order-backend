import { customers } from "@cds-models/sales"
import { CustomerService } from "./protocol";
import { CustomerModel } from "srv/models/customer";

export class CustomerServiceImpl implements CustomerService {
   public afterRead(customerList: customers): customers {
        const customersS = customerList.map((customer) => {
            const customerR = CustomerModel.whit({
                id: customer.id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email
            });
            console.log(customerR)
            return customerR
            .setDefaultDomain()
            .toObject();
        }); 
        console.log(customersS);  
        return customersS;    
    }
}