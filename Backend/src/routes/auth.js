const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Client, Signature, cryptoUtils } = require('dsteem');
const steemClient = new Client('https://api.steemit.com');
const adminService = require('../services/admin');
const logger = require('../utils/logger');


router.post("/login", async function (req, res, next) {
    const { username, message, signed_message: signedMessage } = req.body;

    logger.info('Login attempt', {
        user: username,
        action: 'login',
        data: { message }
    });

    try {
        const [account] = await steemClient.database.getAccounts([username]);
        
        if (!account) {
            logger.warn('Login failed - Account not found', {
                user: username,
                action: 'login',
                error: 'Account not found'
            });
            return res.status(401).json({ error: 'Invalid login details.' });
        }

        const pubPostingKey = account.posting.key_auths[0][0];
        const recoveredPubKey = Signature.fromString(signedMessage)
            .recover(cryptoUtils.sha256(message));

        if (pubPostingKey === recoveredPubKey.toString()) {
            // Check if user is admin
            const isAdmin = await adminService.isAdmin(username);
            
            const token = jwt.sign({
                sub: username,
                isAdmin
            }, process.env.JWT_SECRET, { expiresIn: '72h' });
            
            logger.info('Login successful', {
                user: username,
                action: 'login',
                data: { isAdmin }
            });

            return res.json({ token, isAdmin });
        }

        logger.warn('Login failed - Invalid signature', {
            user: username,
            action: 'login',
            error: 'Invalid signature'
        });
    } catch (err) {
        logger.error('Login error', {
            user: username,
            action: 'login',
            error: err
        });
    }
    return res.status(401).json({ error: 'Invalid login details.' });
});

module.exports = router;