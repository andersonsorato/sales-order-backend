"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerControllerImpl = void 0;
class CustomerControllerImpl {
    constructor(service) {
        this.service = service;
    }
    afterRead(customerList) {
        return this.service.afterRead(customerList);
    }
}
exports.CustomerControllerImpl = CustomerControllerImpl;
