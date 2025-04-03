const jwt = require('jsonwebtoken');
const adminService = require('../services/admin');
const logger = require('../utils/logger');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const path = req.path;
    
    logger.info('Token verification attempt', {
        action: 'verifyToken',
        data: { path }
    });
    
    if (!authHeader) {
        logger.warn('No token provided', {
            action: 'verifyToken',
            data: { path }
        });
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Remove 'Bearer ' prefix if present
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        logger.info('Token verified successfully', {
            user: decoded.sub,
            action: 'verifyToken',
            data: { path, isAdmin: decoded.isAdmin }
        });
        
        next();
    } catch (error) {
        logger.error('Token verification failed', {
            action: 'verifyToken',
            error,
            data: { path }
        });
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const verifyAdmin = async (req, res, next) => {
    const username = req.user?.sub;
    const path = req.path;

    logger.info('Admin verification attempt', {
        user: username,
        action: 'verifyAdmin',
        data: { path }
    });

    try {
        if (!username) {
            logger.warn('Admin verification failed - Invalid user', {
                action: 'verifyAdmin',
                data: { path }
            });
            return res.status(401).json({ message: 'Unauthorized: Invalid user' });
        }

        const isAdmin = await adminService.isAdmin(username);
        if (!isAdmin) {
            logger.warn('Admin verification failed - Not an admin', {
                user: username,
                action: 'verifyAdmin',
                data: { path }
            });
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        logger.info('Admin verified successfully', {
            user: username,
            action: 'verifyAdmin',
            data: { path }
        });

        next();
    } catch (error) {
        logger.error('Admin verification error', {
            user: username,
            action: 'verifyAdmin',
            error,
            data: { path }
        });
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin
};