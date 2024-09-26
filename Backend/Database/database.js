const { MongoClient } = require('mongodb') //Import MongoClient
const dotenv = require('dotenv') 

//Load environment variables form .env file
dotenv.config() 

//Connection string from environment variable
const connstring = process.env.ATLAS_URI

//Create Mongo Client
const client = new MongoClient(connstring)

async function connect() {
    try {
        //Attempt to connect to MongoDB
        await client.connect()
        console.log('MongoDB connected successfully')
    }
    catch (e) {
        console.error('Failed to connect to Mongo', e)
    }
}

//Call Connect function
connect();

module.exports = { connect, client }