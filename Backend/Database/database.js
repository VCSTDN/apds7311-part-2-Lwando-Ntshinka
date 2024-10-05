
const { MongoClient } = require('mongodb') //Import MongoClient
const dotenv = require('dotenv')
const path = require('path')
const jwt = require('jsonwebtoken');
let _db;

//Load environment variables form .env file
dotenv.config({ path: path.resolve(__dirname, './.env') })



//Connection string from environment variable
const connstring = process.env.ATLAS_URI
//Check if connection string is available
if (!connstring) {
    console.error('MongoDB connection string (ATLAS_URI) is missing in the .env file')
    process.exit(1) // Exit the process if connection string is missing
}
else{
    console.log('MongoDB Connection String:', process.env.ATLAS_URI);
}

//Create Mongo Client
const client = new MongoClient(connstring, { useNewUrlParser: true, useUnifiedTopology: true })

async function database_connect() {
    //Attempt to connect to MongoDB
    //client = new MongoClient('mongodb://localhost:433')
        try {
            //this.client = await MongoClient.connect(process.env.MONGO_URI)
            await client.connect(); // Ensure you're connecting properly
            db = client.db()
            console.log('database.js: MongoDB Atlas connected successfully')
            return client;
        }
        catch (error) {
            console.error('database.js: Failed to connect to Mongo', error)
            throw error
            return null
        }
    
    
}

function getDb () {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
}

//Check Authentication pass in reuqests
const checkauth = (req, res, next) => {
    const token = req.header.authorization.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Session Timed Out' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded; // Attach decoded token info to request
        next()
    }
    catch (error) {
        res.status(401).json({ message: 'Please login to access- invalid token' })
        //Redirect to Login page
        console.error(error)
    }
}

////Call Connect function
//database_connect();

module.exports = { database_connect }