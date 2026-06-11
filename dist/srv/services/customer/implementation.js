"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerServiceImpl = void 0;
const customer_1 = require("@/models/customer");
class CustomerServiceImpl {
    afterRead(customerList) {
        const customersS = customerList.map((customer) => {
            const customerR = customer_1.CustomerModel.whit({
                id: customer.id,
                firstName: customer.firstName,
                lastName: customer.lastName ?? '',
                email: customer.email,
            });
            console.log(customerR);
            return customerR.setDefaultDomain().toObject();
        });
        console.log(customersS);
        return customersS;
    }
}
exports.CustomerServiceImpl = CustomerServiceImpl;
