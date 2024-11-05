//Imports
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const databaseFile = require('../Database/database')

//Variable Declaration
const databaseName = 'Banking_International'
const employeeCollection = 'Employees'

class Employee {
    constructor() {
        this.db = null;
        this.collection = null;
        this.emptID = async () => await require('./Database/database')('EMP', 'Employees')
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
            const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,}$/;

            if (!user) {
                console.error('Check Employee.js Line 31')
                return res.status(401).send({ message: 'User login failed' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            // Check if the password meets the regex requirements
            if (passwordRegex.test(user.password)) {
                // Attempt to find the user in the database
                if (!isMatch) {
                    console.error('Check Employee.js Line 37')
                    return res.status(401).json({ message: 'Incorrect email or password' });
                }
                else{
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '20m' }) //Session Lasts 20 min
                res.status(201).json({ message: 'User login successful', token })
                console.log(token)
                }

            }
            else {
                // Password doesn't match
                res.status(401).json({ message: 'Incorrect email or password' })
            }
        }
        catch (error) {
            res.status(400).json({ message: 'Unable to Login Employee!!' });
            console.error('Employee.js unable to login employee',err);
        }

    }
}

module.exports = Employee;



