//Import 
//#region Imports
const express = require('express')
const bodyParser = require('body-parser')
const helmet = require ('helmet')
const https = require('https')
const rateLimit = require('express-rate-limit') //Rate Limiting
const { check, validationResult } = require('express-validator') //Input sanitization
const fs = require('fs')

//Customer and Employee imports
const ExpressBrute = require('express-brute')
const store = new ExpressBrute.MemoryStore()
const brute = new ExpressBrute(store)
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//Payment imports
const path = require('path')
const mongoose = require ('mongoose')
const cors = require('cors') 
//#endregion

//#region  Import Classes
const Payment = require('./model/Make_Payment')
const Employee = require('./model/Employee')
const checkAuthentication = require('./database/checkAuthentication.js')
//#endregion

//#region  Database imports
const { client } = require('./database/database')
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

//#region Customer Requests
// Signup Route
app.post('/signup', brute.prevent, async (req, res) => {
    try {
        // Hashing and salting the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)  // Hash the password with salt
        
        // Creating the user model with the hashed password
        let userModel = {
            id: req.body.id,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            accountnumber: req.body.accountnumber,
            password: hashedPassword // Store the hashed password
        }

        const collection = await db.collection('customers')
        const result = await collection.insertOne(userModel)   
        res.status(201).send(result)
        console.log(`Password for user ${req.body.email} hashed successfully`)

    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Error during signup' })
    }
})

// Login Route
app.post('/login', brute.prevent, async (req, res) => {
// Updated regex pattern: at least 4 characters, at least one special character
const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,}$/;
const collection = db.collection('Customers');

try {
    const user = {
        email: req.body.email,
        password: req.body.password
    }        

    // Check if the password meets the regex requirements
    if (passwordRegex.test(user.password)) {
        // Attempt to find the user in the database
        const existingUser = await collection.findOne({ email: user.email })

        if (existingUser) {

           const passwordMatch = await bcrypt.compare(user.password, existingUser.password)           

            if (passwordMatch) {
                const generatedToken = jwt.sign({ email: req.body.email }, "SecretThing", { expiresIn: "20m"})
                res.status(200).json({ message: 'Login successful', token: generatedToken, email: req.body.email })
                console.log("Token is: ", generatedToken)
            } else {
                // Password doesn't match
                res.status(401).json({ message: 'Incorrect email or password' })
            }
        } else {
            // User doesn't exist
            res.status(404).json({ message: 'Incorrect email or password' })
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

//#region Employee Requests
app.post('/secure_login', 
    [ // Input sanitization and validation
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    ], brute.prevent, 
    async (req, res) => {

        
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    Employee.login_employee(req, res); // Call Employee class logic


    });

//#endregion

//#region Payments

//#region Customer Payments

//Customer- Make Payment
app.post('/make_payment',
    [   //Input Sanitisation
        check('custID').isMongoId().withMessage('Invalid customer ID'),
        check('amount').isFloat({ min: 0 }).withMessage('Invalid payment amount'),
        check('currency').isLength({ min: 3, max: 3 }).withMessage('Invalid currency code'),
        check('SWIFT').isAlphanumeric().withMessage('Invalid SWIFT code')
      ], checkAuthentication,
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

//Customer- View Payments
app.get('/:cust_id/payment_details', checkAuthentication,
    //Input Sanitation
    [check('cust_id').isMongoId().withMessage('Invalid customer ID')],
    async (req, res) => {
        
        try {
            ////Get Customer ID to view details
            const cust_id = req.params.cust_id
            const result = await Make_Payment.view_user_payments(cust_id); //Fetch all payments
            res.status(200).json(result) //Send payment List

            //Access database
            //const paymentDatabase = database.db(databaseName)
            //const collection = database.getDb().collection(paymentCollection)
  
            //Access payments table  
            //const payment = await collection.find( { custId: req.params.custId })
            //res.status(200).json(collection.filter((customer) => customer.custId === req.params.custId))
            //console.log(collection.filter((customer) => customer.custId === req.params.custId))
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
        //const result = await collection.find({}).toArray() //Retrieve data
        
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
        const paymentID = req.params.paymentID
        const result = await Make_Payment.verify_payment(paymentID)
        res.status(200).json(result)
    }

    catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).send('Internal Server Error');
    }
})
//#endregion

//#endregion

module.exports= app


