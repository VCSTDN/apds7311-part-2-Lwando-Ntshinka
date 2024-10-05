//Import 
//#region Imports
const helmet = require ("helmet")
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const mongoose = require ('mongoose')
const cors = require('cors') 
const rateLimit = require('express-rate-limit') //Rate Limiting
const { check, validationResult } = require('express-validator') //Input sanitization
//#endregion

//#region  Import Classes
const Payment = require('./model/Make_Payment')
const Employee = require('./model/Employee')
//#endregion

//#region  Database imports
const database = require('./database/database')
const { MongoClient, ObjectId } = require('mongodb')
const { connect } = require('http2')
const Make_Payment = require('./model/Make_Payment')
//#endregion

//#region  Declare Variables
const port = process.env.PORT || 8443 // Default to port 8443 if port 443 is in use
const databaseName = 'Banking_International'
const paymentCollection = 'Payments'
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
        console.log(`server started on port ${port}`);
      });
    } else {
      app.listen(port, () => {
        console.log(`server started on port ${port} without SSL`);
      });
    }
//#endregion

//#region  Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors()) //Access Make parment Class
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

//#region Employee 
app.post('/secure_login', 
    [ // Input sanitization and validation
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    ],
    async (req, res) => {
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    Employee.login_employee(req, res); // Call Employee class logic
    });


//#endregion

//#region Payments
//Employee View Payments for Users
//Customer- Make Payment
app.post('/make_payment',
    [   //Input Sanitisation
        //check('custID').isMongoId().withMessage('Invalid customer ID'),
        check('amount').isFloat({ min: 0 }).withMessage('Invalid payment amount'),
        check('currency').isLength({ min: 3, max: 3 }).withMessage('Invalid currency code'),
        check('SWIFT').isAlphanumeric().withMessage('Invalid SWIFT code')
      ],
        async(req, res)=>{


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        //const paymentDB = database.paymentDB(databaseName)
        const {payID, custID, amount, currency, SWIFT} = req.body //Payment Constructor

        //Call to make_payment method in Payments Class
        const result = await Make_Payment.make_payment(req.body)
        res.status(201).send('Payment Completed and Pending Verification')
        res.status(201).send(result) //return result of insersion
    }

    catch(error)
    {
        console.error('Error when attempting to make payment', error)
        res.status(500).send('Internal Server Error')
    }
})


app.get('/view_banking_details',
    async(req, res) =>{

    try{
        //const viewPayments = new Payment()
        const result = await Make_Payment.view_all_payments(); //Fetch all payments
        res.status(200).json(result) //Send payment List

        const paymentDatabase = database.db(databaseName) //Access database
        const collection = database.getDb().collection(paymentCollection);
         //Access payments table
        //const result = await collection.find({}).toArray() //Retrieve data
        
    }
    
    catch(error){
        console.error('Error when attempting to retrieve payment details', error)
        res.status(500).send('Internal Server Error')
    }
    })


//Review this code
//Customer- View Payments
app.get('/:cust_id/payment_details',
    //Input Sanitation
    [check('cust_id').isMongoId().withMessage('Invalid customer ID')],
    async (req, res) => {
        try {
            const paymentDatabase = database.database_connect() //Access database
            const viewPayments = new Payment()
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            //Get Customer ID to view details
            const cust_id = req.params.cust_id
            const collection = database.getDb().collection(paymentCollection)
  
            //Access payments table  
            const payment = await collection.find( { custId: req.params.custId })
            res.status(200).json(collection.filter((customer) => customer.custId === req.params.custId))
            console.log(collection.filter((customer) => customer.custId === req.params.custId))
        }

        catch (error) {
            console.error('Error when attempting to retrieve customer payment details: ', error)
            res.status(500).send('Internal Server Error')
        }
    })

//Update payment status
app.patch('/verify_payment/:paymentID', async (req, res) =>{ 
    try {
        const paymentID = req.params.paymentID;
        const payment = new Payment();
        const result = await payment.verify_payment(paymentID);
        res.status(200).json(result);
    }

    catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).send('Internal Server Error');
    }
})
//#endregion

module.exports= app


