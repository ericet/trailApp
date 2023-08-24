const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    console.log("Verify Token")
    const token = req.header('Authorization');
    console.log('token: '+token)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    verifyToken,
};