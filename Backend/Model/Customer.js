const database = require('../Database/database')

class Customer {
    constructor(customerID, customerName, customerSurname, customerIDNumber, 
                customerUsername, customerAccountNo, customerPassword)
    {
        this.customerID = customerID || Customer.generateCustomerID();
        this.custID = null
        this.customerName = customerName
        this.customerSurname = customerSurname
        this.customerIDNumber = customerIDNumber
        this.customerUsername = customerUsername
        this.customerAccountNo = customerAccountNo
        this.customerPassword = customerPassword
    }

// Generate unique customerID
static async generateCustomerID() {
    const collection = await database.connectToCollection('Customers');
    const customerCount = await collection.countDocuments();
    return `CUST${String(customerCount + 1).padStart(3, '0')}`;
    
}

}
module.exports = Customer;