"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModel = void 0;
class CustomerModel {
    constructor(props) {
        this.props = props;
    }
    static whit(props) {
        const customer = new CustomerModel(props);
        customer.setDefaultDomain();
        return customer;
    }
    get id() {
        return this.props.id;
    }
    get firstName() {
        return this.props.firstName;
    }
    get lastName() {
        return this.props.lastName ?? '';
    }
    get email() {
        return this.props.email;
    }
    setDefaultDomain() {
        if (!this.props.email?.includes('@')) {
            this.props.email = `${this.props.email}@defaultdomain.com`;
        }
        return this;
    }
    toObject() {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName ?? '',
            email: this.props.email,
        };
    }
}
exports.CustomerModel = CustomerModel;
