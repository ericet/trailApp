const { emptyOrRows } = require("../helpers");
const db = require("./db");

async function getAllVotedPosts (account) {
    let sql = `SELECT * FROM upvotes where voter = ?`;
    let rows = await db.query(sql, [account]);
    let result = emptyOrRows(rows);
    return result;
}


module.exports = {
    getAllVotedPosts,
}