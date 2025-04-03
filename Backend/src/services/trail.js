const db = require("./db");
const { emptyOrRows, formatDateTime, setStartDate, setEndDate, getRowsSize, setStartMonthDate, setEndMonthDate } = require("../helpers");

//get trail settings
async function getSettings () {
    const rows = await db.query(`SELECT * from cn_trail_settings`);
    const settings = emptyOrRows(rows);
    return settings;
}

async function getAllVoteList () {
    let start = formatDateTime(setStartDate(new Date()));
    let end = formatDateTime(setEndDate(new Date()));
    const rows = await db.query(`SELECT account, sp,votes,totalVotes,permlink,voting_weight,upvote_list.date_time from upvote_list left join upvotes on upvote_list.account = upvotes.voter where upvote_list.date_time between ? and ?`, [start, end]);
    const votesList = emptyOrRows(rows);
    return votesList;
}

async function getVoteListForAccount (account) {
    const rows = await db.query(`SELECT account, sp,votes,totalVotes,permlink,voting_weight,upvote_list.date_time from upvote_list left join upvotes on upvote_list.account = upvotes.voter where account=?;`, [account]);
    const votesList = emptyOrRows(rows);
    return votesList;

}

async function getAllVoteListWithinStartEndDate (date) {
    let start = formatDateTime(setStartDate(new Date(date)));
    let end = formatDateTime(setEndDate(new Date(date)));
    const rows = await db.query(`SELECT account, sp,votes,totalVotes,permlink,voting_weight,upvote_list.date_time from upvote_list left join (SELECT * from upvotes where date_time between ? and ? ) AS upvotes2 on upvote_list.account = upvotes2.voter where upvote_list.date_time between ? and ?`, [start, end, start, end]);
    const votesList = emptyOrRows(rows);
    return votesList;
}
async function getVoteListForAccountWithinStartEndDate (date, account) {
    let start = formatDateTime(setStartDate(new Date(date)));
    let end = formatDateTime(setEndDate(new Date(date)));
    let sql = `SELECT account, sp,votes,totalVotes,permlink,voting_weight,upvote_list.date_time from upvote_list left join (SELECT * from upvotes where date_time between ? and ? ) AS upvotes2 on upvote_list.account = upvotes2.voter where upvote_list.date_time between ? and ? and account=?`;
    const rows = await db.query(sql, [start, end, start, end, account]);
    const votesList = emptyOrRows(rows);
    return votesList;
}


async function getAllPending () {
    const rows = await db.query(`SELECT * from missing_votes where hasVoted=false`);
    const pendingList = emptyOrRows(rows);
    return pendingList;
}

async function checkIfReported (account, permlink) {
    const rows = await db.query(`SELECT * from missing_votes where account=? and permlink=?`, [account, permlink]);
    let size = getRowsSize(rows);
    if (size > 0) {
        return true;
    }
    return false;
}

async function checkIfEligibleToReport(date,account){
    let start = formatDateTime(setStartDate(new Date(date)));
    let end = formatDateTime(setEndDate(new Date(date)));
    let sql = `SELECT account, sp,votes,totalVotes,permlink,voting_weight,upvote_list.date_time from upvote_list left join (SELECT * from upvotes where date_time between ? and ? ) AS upvotes2 on upvote_list.account = upvotes2.voter where upvote_list.date_time between ? and ? and account=? and permlink is null;`;
    const rows = await db.query(sql,[start,end,start,end,account]);
    let size = getRowsSize(rows);
    if (size > 0) {
        return true;
    }
    return false;
}

async function report (userInput) {
    let sql = `INSERT INTO missing_votes (account,permlink,sp,hasVoted,date_time) values (? ,? ,? ,? ,? )`;
    const result = await db.query(sql,[userInput.account,userInput.permlink,userInput.sp,userInput.hasVoted,userInput.date]);
    if(result.affectedRows){
        return true;
    }
    return false;
}

async function getAccountUpvotes(account, year, month) {
    const startDate = setStartMonthDate(year, month);
    const endDate = setEndMonthDate(year, month);
    const rows = await db.query(
        `SELECT * FROM upvotes WHERE voter = ? AND date_time BETWEEN ? AND ?`,
        [account, formatDateTime(startDate), formatDateTime(endDate)]
    );
    return emptyOrRows(rows);
}

async function getScore(account) {
    const rows = await db.query(
        `SELECT * FROM upvote_list WHERE account = ? ORDER BY date_time DESC LIMIT 1`,
        [account]
    );
    const result = emptyOrRows(rows);
    return result[0];
}

async function searchUserPosts(username) {
    // Get posts from the last 7 days using Steem API
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const posts = await steem.api.getDiscussionsByAuthorBeforeDateAsync(
        username,
        null, // Start permlink (null for latest)
        sevenDaysAgo.toISOString().split('.')[0],
        10 // Limit to 10 posts
    );

    // Filter out posts older than 7 days and format the response
    return posts
        .filter(post => new Date(post.created + 'Z') > sevenDaysAgo)
        .map(post => ({
            title: post.title,
            permlink: post.permlink,
            created: post.created
        }));
}

async function addToPendingVotes(data) {
    const { account, permlink, votingWeight } = data;
    
    // Check if already in pending votes
    const existing = await db.query(
        'SELECT * FROM pending_votes WHERE account = ? AND permlink = ?',
        [account, permlink]
    );

    if (existing.length > 0) {
        throw new Error('Post is already in pending votes');
    }

    // Add to pending votes
    await db.query(
        'INSERT INTO pending_votes (account, permlink, voting_weight, date_time) VALUES (?, ?, ?, NOW())',
        [account, permlink, votingWeight]
    );

    return { success: true };
}

module.exports = {
    getSettings,
    getAllVoteList,
    getVoteListForAccount,
    getAllVoteListWithinStartEndDate,
    getVoteListForAccountWithinStartEndDate,
    getAllPending,
    checkIfEligibleToReport,
    report,
    checkIfReported,
    getAccountUpvotes,
    getScore,
    searchUserPosts,
    addToPendingVotes
};