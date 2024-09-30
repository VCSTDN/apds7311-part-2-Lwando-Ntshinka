//Import 
const https = require('https')
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require ('mongoose')
const Item = require('Model/Customer');
const cors = require('cors') 
const make_payment = require('/MakePayment')

//Database imports
const database = ('./Database/database')
const { ObjectId } = require('mongodb')

const app = express();


//Declare Variables
const port = 100

//Create Server
const server = http.createServer({
    key: fs.readFileSync('Keys/bankprivatekey.pem'),
    cert: fs.readFileSync('Keys/certificate.pem')
}, app) //Passes request through server with private key and certificate


//Middleware













app.listen(PORT, () => {
    console.log(`server started inport ${PORT}`);
})