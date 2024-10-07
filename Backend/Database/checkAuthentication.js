const jwt = require('jsonwebtoken');

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

module.exports = checkauth