const jwt = require('jsonwebtoken');

// Define the tokens object to manage session tokens (in-memory for now)
const tokens = {};

// Check Authentication in requests
const checkauth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Session Timed Out' });
    }

    // Split the "Bearer" from the token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    // Check if the token exists in the tokens object
    const tokenData = tokens[token];
    if (!tokenData) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        // Check if the token is expired
        if (Date.now() > tokenData.expirationTime) {
            delete tokens[token];  // Clean up expired tokens
            return res.status(401).json({ message: 'Session expired, please log in again' });
        }

        req.user = tokenData; // Attach decoded token info to request
        next();
    } catch (error) {
        // Redirect to Login page
        console.error(error);
        return res.status(401).json({ message: 'Please login to access - invalid token' });
    }
};

module.exports = checkauth;
