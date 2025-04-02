const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    console.log("Verify Token");
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Remove 'Bearer ' prefix if present
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    verifyToken,
};