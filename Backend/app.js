//Import 
//#region Imports
const express = require('express')
const bodyParser = require('body-parser')
const helmet = require ('helmet')
const https = require('https')
const rateLimit = require('express-rate-limit') //Rate Limiting
const { check, validationResult } = require('express-validator') //Input sanitization
const fs = require('fs')

const ExpressBrute = require('express-brute')
const store = new ExpressBrute.MemoryStore()
const brute = new ExpressBrute(store)
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const path = require('path')
const mongoose = require ('mongoose')
const cors = require('cors') 
//#endregion

//#region  Import Classes
const Payment = require('./Model/Make_Payment') 
const Employee = require('./model/Employee')
const Customer = require('../backend/Model/Customer')
const checkAuthentication = require('../backend/Database/checkAuthentication')
//#endregion

//#region  Database imports
const { client } = require('../backend/Database/database')
const database = require('../backend/Database/database')
const { MongoClient, ObjectId } = require('mongodb')
const { connect } = require('http2')
const Make_Payment = require('./Model/Make_Payment')
const { markAsUntransferable } = require('worker_threads')
//#endregion

//#region  Declare Variables
const port = 433/*process.env.PORT*/
const databaseName = 'Banking_International'
const paymentCollection = 'Payments'
const customerCollection = 'Customers'
const employeeCollection = 'Payments'
const tokens = {}; // Initialize token storage for development purposes
let loginUserID;
//#endregion

//#region  Create Server
const app = express();
//#endregion

//#region  SSL Certificates
const privateKeyPath = path.resolve(__dirname, './Keys/bankprivatekey.pem')
const certificatePath = path.resolve(__dirname, './Keys/certificate.pem')


if (!fs.existsSync(privateKeyPath) || !fs.existsSync(certificatePath)) { //Check for certificates
  console.error('SSL key or certificate not found')
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === 'production' //Initialise server
if (isProduction) {
    const server = https.createServer({
          key: fs.readFileSync(path.resolve(privateKeyPath)),
          cert: fs.readFileSync(path.resolve(certificatePath))
      }, app);
      server.listen(port, () => {
        console.log(`server started on port ${port} with SSL`);
      });
    } else {
      app.listen(port, () => {
        console.log(`server started on port ${port} without SSL`);
      });
    }
//#endregion

//#region  Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(
    ({
    origin: 'https://localhost:3000', // Specify the origin that is allowed
    credentials: true, // Enable cookies or auth headers
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Ensure all methods are allowed
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization']
    }))) //Access Make parment Class
app.options('*', cors()); // Enable pre-flight (OPTIONS) requests for all routes
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "https://ajax.googleapis.com"],
        "style-src": ["'self'", "'unsafe-inline'"],
      },
    },
  })) //Use helmet for cross site scripting
  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY'); // Prevent clickjacking
    next();
  });
//#endregion

//#region Rate limiting middleware
const limiter = rateLimit({
    windowMs: 20 * 60 * 1000, // 20 minutes
    max: 50 // Limit each IP to 100 requests per windowMs
});
//Implement Rate Limiting for DDoS Protection
app.use(limiter)
//#endregion

//#region  Connect to database
database.database_connect()
.then(() => console.log('app.js: Database is connected successfully!'))
.catch((err) => console.error('app.js: Failed to connect to the database:', err))

//#endregion

//#region Customer Regisetr and Customer & Employee LoginRequests
// Signup Route
//app.post('/signup', brute.prevent, async (req, res) => {
//    try {
//        // Hashing and salting the password
//        const hashedPassword = await bcrypt.hash(req.body.password, 10)  // Hash the password with salt
//        
//        // Creating the user model with the hashed password
//        let userModel = {
//            custID: Customer.generateCustomerID(), //Generate Customer ID
//            name: req.body.name,
//            surname: req.body.surname,
//            IDNumber: req.body.IDNumber, 
//            username: req.body.username, 
//            accountNumber: req.body.accountNumber,
//            password: hashedPassword // Store the hashed password
//        }
//
//        //Declare Database
//        this.client = await database.database_connect()
//        const db = this.client.db('Banking_International')
//        const collection = await db.collection('Customers')
//        const result = await collection.insertOne(userModel)   
//        res.status(201).send(result)
//        console.log(`Password for user ${req.body.email} hashed successfully`)
//
//    } catch (err) {
//        console.error(err)
//        res.status(500).send({ message: 'Error during signup' }, err)
//    }
//})


// Login Route


app.post('/login', brute.prevent, async (req, res) => {
// Updated regex pattern: at least 4 characters, at least one special character
const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,}$/

//Initialise Database
this.client = await database.database_connect()
const db = this.client.db(databaseName)
const mongoCustomersCollection = await db.collection(customerCollection)
const mongoEmployeesCollection = await db.collection(employeeCollection)

try {
    const user = { 
        username: req.body.username, 
        accountNumber: req.body.accountNumber, 
        password: req.body.password 
    };


    // Check if the password meets the regex requirements
    if (passwordRegex.test(user.password)) {

        // Attempt to find the user in the database
        const existingCustomer = await mongoCustomersCollection.findOne({ accountNumber: user.accountNumber }, {username: user.username})
        let userType = customerCollection
        let existingUser = existingCustomer || existingEmployee //see if user is a customer or employee

        if(!existingCustomer)
        {
            const existingEmployee = await mongoEmployeesCollection.findOne({ accountNumber: user.accountNumber }, {username: user.username})
            userType = employeeCollection
            existingUser = existingEmployee;
        }

        //If user is not present
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
       
            // Generate JWT token with userID included
           const passwordMatch = await bcrypt.compare(user.password, existingUser.password)           

            if (passwordMatch) {
                const payload = {
                    accountNumber: req.body.accountNumber,
                    _id: existingUser._id.toString(),
                    userType: userType,
                    //custID: existingUser.custID // Assuming this exists in the user data
                };
                loginUserID = existingUser._id.toString() // Ensure the header key matches the one set by the client
                const  _id  = loginUserID // Destructure safely

                const generatedToken = jwt.sign({ email: req.body.email }, 'ThisIsTheStringThatWillBeUsedToEncryptTheTokenGenerated', { expiresIn: "20m"})
                console.log(`Token : ${generatedToken}`)
                res.status(200).json({ message: 'Login successful', 
                                    token: generatedToken, 
                                    email: req.body.email, 
                                    _id: existingUser._id.toString(),
                                    userType })
                                    console.log(`Login Successful for ${req.body.username} ID1: {_id: ${_id}}`)
            } 
            else {
                // Password doesn't match
                res.status(401).json({ message: 'Incorrect Credentials' })
            }
        
    } else {
        // Password doesn't meet regex requirements
        res.status(400).json({ message: 'Invalid password format' })
    }
} catch (e) {
    console.error('Error occurred during login: ', e);
    res.status(500).json({ message: 'Internal server error' })
}
})
//#endregion

//#region Customer Payments

//Verify token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, 'ThisIsTheStringThatWillBeUsedToEncryptTheTokenGenerated', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // Store the decoded user info in req.user
        next();
    });
};

//Customer- Make Payment
app.post('/make_payment',brute.prevent,
    [   //Input Sanitisation
        check('amount').isFloat({ min: 0 }).withMessage('Invalid payment amount'),
        check('currency').isLength({ min: 3, max: 3 }).withMessage('Invalid currency code'),
        check('SWIFT').isAlphanumeric().isLength({ min: 8, max: 12 }).withMessage('SWIFT code must be either 8 or 12 characters'),
    ], 
    //checkAuthentication
        async(req, res)=>{

    //Validate Result
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        //Payment Constructor
        const { _id } = loginUserID;
        const { amount, currency, SWIFT} = req.body 
        const sanitizedSWIFT = SWIFT.slice(0, 12);
        if (sanitizedSWIFT.length !== 8 && sanitizedSWIFT.length !== 11) {
            return res.status(400).json({ errors: [{ msg: 'SWIFT code must be either 8 or 11 characters' }] });
        }

        //Call to make_payment method in Payments Class
        const result = await Make_Payment.make_payment({ loginUserID ,amount, currency, sanitizedSWIFT })
        res.status(201).send(result) //return result of insersion
    }

    catch(error)
    {
        console.error('Error when attempting to make payment', error)
        res.status(500).send('Internal Server Error')
    }
})

//Customer- View Payments
app.get('/:~{loginUserID}`/payment_details', 
    //Input Sanitation
    [check('loginUserID').isMongoId().withMessage('Invalid ID')],
    //Check Authentication
    checkAuthentication,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            ////Get Customer ID to view details
            const custID  = req.params._id
            const result = await Make_Payment.view_user_payments(custID); //Fetch all payments
            res.status(200).json(result) //Send payment List
            console.log(result)
        }

        catch (error) {
            console.error('app.js: Error when attempting to retrieve customer payment details: ', error)
            res.status(500).send('Internal Server Error')
        }
    })
//#endregion

//#region Employee Payments

//Employee View Payments for Users
app.get('/view_banking_details', checkAuthentication,
    async(req, res) =>{

    try{
        const result = await Make_Payment.view_all_payments(); //Fetch all payments
        res.status(200).json(result) //Send payment List

        const paymentDatabase = database.db(databaseName) //Access database
        const collection = database.getDb().collection(paymentCollection);
         //Access payments table
        
    }
    
    catch(error){
        console.error('Error when attempting to retrieve payment details', error)
        res.status(500).send('Internal Server Error')
    }
    }) 

//Update payment status
app.patch('/verify_payment/:paymentID',  checkAuthentication,
    check('payID').isMongoId().withMessage('Invalid customer ID'),
    async (req, res) =>{ 
    try {
        const query = {_id: new ObjectId(req.params.id)}
        const PendingPayementsCollection = db.collection('PendingPayements')
        const ConfirmedPayementsCollection = db.collection('ConfirmedPayements')
        const confirmedTransaction = await PendingPayementsCollection.findOne(query)

        let result = await PendingPayementsCollection.deleteOne(query)
        await ConfirmedPayementsCollection.insertOne(confirmedTransaction)
        
        res.status(200).send(result)
    }

    catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).send('Internal Server Error');
    }
})
//#endregion

module.exports= app


