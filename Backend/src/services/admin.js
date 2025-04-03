const db = require("./db");
const { emptyOrRows } = require("../helpers");

async function isAdmin(username) {
    const rows = await db.query(
        'SELECT * FROM admin_users WHERE username = ?',
        [username]
    );
    return rows.length > 0;
}

module.exports = {
    isAdmin
};
