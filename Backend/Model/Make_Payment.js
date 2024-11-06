const database = require('../Database/database')
const { MongoClient } = require('mongodb')

//Variable declaration
const databaseName = 'Banking_International'
const paymentCollection = 'Payments'


class Make_Payment {
    constructor(custID,paymentAmount, paymentCurrency, SWIFTNo)
    {
        this.payID = null //set in make_payment
        this.custID = custID;
        this.paymentAmount = paymentAmount
        this.paymentCurrency = paymentCurrency
        this.SWIFTNo = SWIFTNo
        this.paymentStatus = "pending"
    }

    //Initialise constructor and collection
    static async initialiseDatabase(){
        try{
            if(!this.client){
                //Initialise database
                this.client = await database.database_connect()
                console.log("Make_Payment.js: Database client initialized successfully")
            }
            this.collection = this.client.db(databaseName).collection(paymentCollection);
        }
        catch(error){
            console.error("Make_Payment.js: Error initializing database", error)
            throw error;  // Throw error so it can be caught by the calling function
        }
        
    }

        //Generate Payment
        static async generatePaymentID() {
            const paymentCount = await this.collection.countDocuments();
            return `PAY${String(paymentCount + 1).padStart(3, '0')}`;
        }

    //#region Customer Payment Transactions
    static async make_payment(paymentData) { //Post Request for Customers
        try {
            await this.initialiseDatabase() //Initialise database
            console.log('Make_Payment.js make_payment method: Database client initialized successfully')
            
            //Initialise database
            const payment = {
                payID: await this.generatePaymentID(),
                _id: paymentData._id,
                amount: paymentData.amount,
                currency: paymentData.currency,
                SWIFT: paymentData.SWIFT,
                paymentStatus: "pending",
                createdAt: new Date()
            };

            // Insert the payment into the 'payments' collection
            const result = await this.collection.insertOne(payment);
            console.log(`Make_Payment.js: Payment added with id: ${result.insertedId}`);
            return result;
        }

        catch (error) {
            console.error("Make_Payment.js: Error in make_Payment:", error);
            throw error;
        } 
        
        finally {
            if (this.client) {
                await this.client.close(); // Close the connection
            }
        }

    }

    static async view_user_payments(custID){ //Get Request for Customers
        try{
            //Initialise database
            await this.initialiseDatabase()

            const payments = await this.collection.find({ custID }).toArray();

            return payments
        }

        catch (error)
        {
            console.error('Make_Payments.js: Error when fetching payments (in view_user_payments):', error);
            throw error
        }
    }
    //#endregion

    //#region Employee Payment Transactions
    //Get Request for Employees
    static async view_all_payments(){ 
        
        try{
            //Initialise database
            await this.initialiseDatabase()

            const result = await this.collection.find({}).toArray() //Get payments
            return result
        }

        catch (error)
        {
            console.error('Error when fetching payments (in view_all_payments):', error);
            throw error
        }
    }

    static async verify_payment(paymentID){ //Patch Request for Employees
        try {
            //Initialise database
            await this.initialiseDatabase() 

            //Locate payment and update status
            const result = await this.collection.updateOne(
                { _id: new MongoClient.ObjectId(paymentID) },
                { $set: { paymentStatus: "verified" } }
            );
            if (result.modifiedCount > 0) {
                console.log(`Payment with ID ${paymentID} has been verified.`);
                return { status: 'success', message: 'Payment verified' };
              } 
            else {
                return { status: 'fail', message: 'Payment not found' };
              }
        } catch (error) {
            console.error('Make_Payment.js: Error verifying payment:', error);
            throw error;
        }
    
    }
    //#endregion
}


module.exports = Make_Payment;