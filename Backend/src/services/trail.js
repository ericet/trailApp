const db = require("./db");
const { emptyOrRows, formatDateTime, setStartDate, setEndDate, getRowsSize } = require("../helpers");

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


module.exports = {
    getSettings,
    getAllVoteList,
    getVoteListForAccount,
    getAllVoteListWithinStartEndDate,
    getVoteListForAccountWithinStartEndDate,
    getAllPending,
    checkIfEligibleToReport,
    report,
    checkIfReported
};