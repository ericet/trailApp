const express = require("express");
const router = express.Router();
const trail = require("../services/trail");

router.get("/getSettings", async function (req, res, next) {
    try {
        res.json(await trail.getSettings());
    } catch (err) {
        console.error(`Error while getting settings `, err.message);
        next(err);
    }
});

router.get("/getList", async function (req, res, next) {
    try {
        let account = req.query.account;
        let date = req.query.date;
        if (!account && !date) {
            res.json(await trail.getAllVoteList());
        } else if (!date && account) {
            res.json(await trail.getVoteListForAccount(account))
        } else if(date && !account){
            res.json(await trail.getAllVoteListWithinStartEndDate(date));
        }else if(date && account){
            res.json(await trail.getVoteListForAccountWithinStartEndDate(date,account));
        }
    } catch (err) {
        console.error(`Error while getting all votes list `, err.message);
        next(err);
    }
});

router.get("/getPendings", async function (req, res, next) {
    try {
        res.json(await trail.getAllPending());
    } catch (err) {
        console.error(`Error while getting all pendings list `, err.message);
        next(err);
    }
});

router.post("/report", async function (req, res, next) {
    try {
        const userInput = req.body;
        let isReported = await trail.checkIfReported(userInput.account, userInput.permlink);
        if (isReported) {
            let isEligible = await trail.checkIfEligibleToReport(userInput.date, userInput.account);
            if (isEligible) {
                let result = await trail.report(userInput);
                if (result) {
                    let output = new Object();
                    output.ok = 1;
                    output.n = 1;
                    res.json({ result: output, msg: "You have been successfully reported!", error: null });
                } else {
                    const error = new Error("Failed to insert Document");
                    error.status = 400;
                    next(error);
                }
            } else {
                res.json({ result: "false", msg: "This post is NOT eligible to receive an upvote!", error: "exist" });
            }
        } else {
            res.json({ result: "false", msg: "You have been already reported!", error: "exist" });
        }
    } catch (err) {
        console.error(`Error while getting all votes list `, err.message);
        next(err);
    }

});




module.exports = router;