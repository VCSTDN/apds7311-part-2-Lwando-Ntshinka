


class customer {
    constructor(customerID, customerName, customerSurname, 
                customerAccountNo, customerPassword)
    {
        this.customerID = customerID;
        this.custID = async () => await require('../Database/database')('CUS', 'Customers')
        this.customerName = customerName;
        this.customerSurname = customerSurname;
        this.customerAccountNo = customerAccountNo;
        this.customerPassword = customerPassword;
    }

}