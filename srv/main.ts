import{ Service } from "@sap/cds";
import {customer, customers} from "@cds-models/sales";
import { ResultSet } from "@sap/hana-client";
import console from "console";

export default (service: Service) => {
    service.after('READ', "customers", (results: customers) => {
        results.forEach((customer: customer) => {
            if (!customer.email?.includes('@')) {
                customer.email = `${customer.email}@gmail.com`;
            }});
     console.log(results);        
});
}