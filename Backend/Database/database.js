
const { MongoClient } = require('mongodb') //Import MongoClient
const dotenv = require('dotenv')
const path = require('path')
const jwt = require('jsonwebtoken');
let db = null;


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
    console.log('database.js: MongoDB ATLAS CONNECTED');
}

//Create Mongo Client
const client = new MongoClient(process.env.ATLAS_URI)

async function database_connect() {
        //Attempt to connect to MongoDB
        try {
            if (!db){
                await client.connect(); // Ensure you're connecting properly
                db = client.db()
                console.log('database.js: MongoDB Atlas connected successfully')
            }
            return client;
        }
        catch (error) {
            console.error('database.js: Failed to connect to Mongo', error)
            throw error
            return null
        }
}

// Connect to a specific collection
async function connectToCollection(collectionName) {
    if (!db) {
        await database_connect(); // Ensure the database is connected
    }
    return db.collection(collectionName);
}

function getDb () {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
}

module.exports = { database_connect, connectToCollection, getDb }