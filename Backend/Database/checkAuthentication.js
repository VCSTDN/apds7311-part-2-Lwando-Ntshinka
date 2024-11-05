const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); //Hashing passwords

// Define the tokens object to manage session tokens (in-memory for now)
const tokens = {};

// Check Authentication in requests
const checkauth = (req, res, next) => {

    try {

        const token = req.header.authorization.split(' ')[1]
        jwt.verify(token, 'ThisIsTheStringThatWillBeUsedToEncryptTheTokenGenerated')
        next()
    } catch (error) {
        // Redirect to Login page
        console.error(error);
        
        return res.status(401).json({ message: 'Please login to access - invalid token' });
    }
};

module.exports = checkauth
