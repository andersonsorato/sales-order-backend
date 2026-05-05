
type CustomerProps = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}
export class CustomerModel {
    constructor(private props: CustomerProps){}

    public static create(props: CustomerProps): CustomerModel {
        const customer = new CustomerModel(props);
        customer.setDefaultDomain();
        return customer;
    }

    public get id(){
        return this.props.id;
    }
    public get firstName(){
        return this.props.firstName;
    }
    public get lastName(){
        return this.props.lastName;
    }
    public get email(){
        return this.props.email;
    }

    public setDefaultDomain(): CustomerModel{
        if (!this.props.email.includes('@')){
            this.props.email = `${this.props.email}@defaultdomain.com`;
        }
        return this;
    }

    public toObject(): CustomerProps {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            email: this.props.email
        }
    }
}