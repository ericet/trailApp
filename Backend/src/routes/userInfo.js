const express = require("express");
const router = express.Router();
const userInfo = require("../services/userInfo");
const {verifyToken} = require('../middleware/authMiddleware');


router.get("/getVotedPosts",verifyToken, async function (req, res, next) {
    try {
        console.log(req.user)
        res.json(await userInfo.getAllVotedPosts(req.user.sub));
    } catch (err) {
        console.error(`Error while getting all voted posts `, err.message);
        next(err);
    }
});

module.exports = router;