
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
    console.log('MongoDB ATLAS CONNECTED');
}

//Create Mongo Client
const client = new MongoClient(process.env.ATLAS_URI)

async function database_connect() {
        //Attempt to connect to MongoDB
        try {
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

// Utility function to generate custom IDs based on the number of entries
async function  generateCustomID (prefix, collection) {
    const counterCollection = db.collection('Counters'); // Counter collection to track sequences
    const counter = await counterCollection.findOneAndUpdate(
        { _id: prefix }, // Each prefix (CUSID, EMPID, PAYID) gets its own sequence
        { $inc: { seq: 1 } }, // Increment sequence number by 1
        { returnDocument: 'after', upsert: true } // Return updated document, insert if doesn't exist
    );

    const idNumber = counter.value.seq.toString().padStart(6, '0'); // Pad with leading zeros for 6-digit format
    return `${prefix}${idNumber}`;
};




function getDb () {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
}

module.exports = { database_connect }