const jwt = require('jsonwebtoken');

//Check Authentication pass in reuqests
const checkauth = (req, res, next) => {
    const authHeader = req.headers.authorization


    if (!authHeader) {
        return res.status(401).json({ message: 'Session Timed Out' });
    }
    else {
        const token = authHeader.split('')[1];
        if (!token || tokens[token]) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
    try {
        // Check if the token is expired
        const tokenData = tokens[token];
        if (Date.now() > tokenData.expirationTime) {
            delete tokens[token];  // Clean up expired tokens
            return res.status(401).json({ message: 'Session expired, please log in again' });
        }

        //const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //req.user = decoded; // Attach decoded token info to request
        req.user = tokenData; // Attach decoded token info to request
        next()
    }
    catch (error) {
        res.status(401).json({ message: 'Please login to access- invalid token' })
        //Redirect to Login page
        console.error(error)
    }
}

module.exports = checkauth