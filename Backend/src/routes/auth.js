const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Client, Signature, cryptoUtils } = require('dsteem');
const steemClient = new Client('https://api.steemit.com');


router.post("/login", async function (req, res, next) {
    try {
        const { username, message, signed_message: signedMessage } = req.body;
        const [account] = await steemClient.database.getAccounts([username]);
        const pubPostingKey = account.posting.key_auths[0][0];
        const recoveredPubKey = Signature.fromString(signedMessage)
            .recover(cryptoUtils.sha256(message));

        if (pubPostingKey === recoveredPubKey.toString()) {
            const token = jwt.sign({
                sub: username,
            }, process.env.JWT_SECRET, { expiresIn: '72h' });
            console.log(token)
            return res.json({ token });
        }
    } catch (e) {
        console.log(e);
    }
    return res.json({ error: 'Invalid login details.' });
});

module.exports = router;