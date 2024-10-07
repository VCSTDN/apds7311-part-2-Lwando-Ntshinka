const database = require("../database/database")
const { MongoClient } = require('mongodb')

//Variable declaration
const databaseName = 'Banking_International'
const paymentCollection = 'Payments'


class Make_Payment {
    constructor(paymentID, paymentAmount, paymentCurrency, SWIFTNo)
    {
        this.db = null
        //this.collection = null;
        this.client = null
        this.paymentID = paymentID
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
                this.client = await require('../database/database').database_connect()
                console.log("Make_Payment.js: Database client initialized successfully")
            }
            //this.collection = this.client.db(databaseName).collection(paymentCollection);
            //return this.client
        }
        catch(error){
            console.error("Make_Payment.js: Error initializing database", error)
            throw error;  // Throw error so it can be caught by the calling function
        }
        
    }

    //#region Customer Payment Transactions
    static async make_payment(paymentData) { //Post Request for Customers
        try {
            await this.initialiseDatabase() //Initialise database

            //Initialise database
            const db = this.client.db('Banking_International')
            const collection = db.collection('Payments');

            // Insert the payment into the 'payments' collection
            const result = await collection.insertOne(paymentData);

            console.log(`Make_Payment.js: Payment added with id: ${result.insertedId}`);
            return result;
        }

        catch (error) {
            console.error('Make_Payment.js: Error in make_Payment:', error);
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
            const db = this.client.db('Banking_International')
            const collection = db.collection('Payments');

            const result = await collection.find({ custID }).toArray() //Get payments
            return result
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
            const db = this.client.db('Banking_International')
            const collection = db.collection('Payments')


            const result = await collection.find({}).toArray() //Get payments
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
            const db = this.client.db('Banking_International')
            const collection = db.collection('Payments')

            //Locate payment and update status
            const result = await collection.updateOne(
                { paymentID: new ObjectId(paymentID) },
                { $set: { paymentStatus: 'approved' } }
            );
            if (result.modifiedCount > 0) {
                console.log(`Payment with ID ${paymentID} has been verified.`);
                return { status: 'success', message: 'Payment verified' };
              } else {
                return { status: 'fail', message: 'Payment not found' };
              }
        } catch (error) {
            console.error('app.js: Error verifying payment:', error);
            throw error;
        }
    
    }
    //#endregion
}


module.exports = Make_Payment;