function emptyOrRows (rows) {
    if (!rows) {
        return [];
    }
    return rows;
}

function getRowsSize (rows) {
    if (!rows) {
        return 0;
    }
    return rows.length;
}

function setStartDate (date) {
    date.setDate(date.getDate())
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

function setEndDate (date) {
    date.setDate(date.getDate())
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);
    return date;
}

function formatDateTime (datetime) {
    let date = datetime.toLocaleString('en-US', { hourCycle: 'h23' }).split(" ");
    let time = date[1];
    let mdy = date[0];
    mdy = mdy.split('/');
    let month = parseInt(mdy[0]);
    let day = parseInt(mdy[1]);
    let year = parseInt(mdy[2]);
    return year + '-' + month + '-' + day + ' ' + time;
}

module.exports = {
    emptyOrRows,
    setStartDate,
    setEndDate,
    formatDateTime,
    getRowsSize
};