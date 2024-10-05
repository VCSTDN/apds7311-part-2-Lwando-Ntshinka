//Imports
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Variable Declaration
const databaseName = 'Banking_International'
const employeeCollection = 'Employees'

class Employee {
    constructor() {
        this.db = null;
        this.collection = null;
    }

    //Initialise constructor and collection
    async initialiseDatabase() {
        if (!this.db) {
            this.db = client.db(databaseName) //Database
            this.collection = this.db.collection(employeeCollection) //Payments (changed from payments to paymentCollection)
        }
    }

    static async login_employee(req, res) {
        try {
            const { email, password } = req.body;
            const user = await Employee.findOne({ email });

            if (!user) {
                console.error('Check Employee.js Line 31')
                return res.status(401).send({ message: 'User login failed' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.error('Check Employee.js Line 37')
                return res.status(401).json({ message: 'User login failed' });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '0.5h' }) //Session Lasts 20 min
            res.status(201).json({ message: 'User login successful', token });
            console.log(token);
        }
        catch (error) {
            res.status(400).json({ message: 'Major Error occurred, Unable to Login Employee!!' });
            console.error(err);
        }

    }
}

module.exports = Employee;



