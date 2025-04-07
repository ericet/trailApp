const express = require("express");
const router = express.Router();
const trail = require("../services/trail");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

router.post("/addToPending", verifyToken, verifyAdmin, async function (req, res, next) {
    const admin = req.user.sub;
    const { account, permlink, votingWeight } = req.body;

    logger.info('Adding post to pending votes', {
        user: admin,
        action: 'addToPending',
        data: { account, permlink, votingWeight }
    });

    try {
        // Validate voting weight
        if (typeof votingWeight !== 'number' || votingWeight < 0.01 || votingWeight > 100) {
            logger.warn('Invalid voting weight', {
                user: admin,
                action: 'addToPending',
                error: 'Invalid voting weight',
                data: { votingWeight }
            });
            return res.status(400).json({ error: 'Voting weight must be between 0.01 and 100' });
        }

        const result = await trail.addToPendingVotes({ account, permlink, votingWeight });
        
        logger.info('Successfully added post to pending votes', {
            user: admin,
            action: 'addToPending',
            data: { account, permlink, votingWeight }
        });

        res.json(result);
    } catch (err) {
        logger.error('Failed to add post to pending votes', {
            user: admin,
            action: 'addToPending',
            error: err,
            data: { account, permlink, votingWeight }
        });

        res.status(err.message === 'Post is already in pending votes' ? 400 : 500)
           .json({ error: err.message });
    }
});

router.get("/getSettings", async function (req, res, next) {
    try {
        logger.info('Fetching trail settings');
        const settings = await trail.getSettings();
        logger.info('Successfully fetched trail settings', { data: settings });
        res.json(settings);
    } catch (err) {
        logger.error('Failed to fetch trail settings', { error: err });
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
        } else if (date && !account) {
            res.json(await trail.getAllVoteListWithinStartEndDate(date));
        } else if (date && account) {
            res.json(await trail.getVoteListForAccountWithinStartEndDate(date, account));
        }
    } catch (err) {
        console.error(`Error while getting all votes list `, err.message);
        next(err);
    }
});

router.get("/getUpvotes", verifyToken, async function (req, res, next) {
    try {
        const account = req.user.sub; // Get username from JWT sub claim
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);
        const upvotes = await trail.getAccountUpvotes(account, year, month);
        res.json(upvotes);
    } catch (err) {
        console.error(`Error while getting upvotes`, err.message);
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

// Admin routes
router.get("/searchPosts", verifyToken, verifyAdmin, async function (req, res, next) {
    try {
        // TODO: Add admin role check
        if (!req.query.username) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }
        const posts = await trail.searchUserPosts(req.query.username);
        res.json(posts);
    } catch (err) {
        console.error(`Error searching posts:`, err.message);
        next(err);
    }
});

router.get("/getScore", async function (req, res, next) {
    try {
        const account = req.query.account;
        const score = await trail.getScore(account);
        res.json(score);
    } catch (err) {
        console.error(`Error while getting score`, err.message);
        next(err);
    }
});

router.post("/report", async function (req, res, next) {
    try {
        const userInput = req.body;
        let isReported = await trail.checkIfReported(userInput.account, userInput.permlink);
        if (!isReported) {
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
