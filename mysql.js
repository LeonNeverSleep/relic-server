var mysql = require('mysql')

var pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'relic-management',
});

var querySql = function (sql, params = null, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            connection.query(sql, params, function (err, results) {
                console.log(results);
                callback(err, results);
                connection.release();
            })
        }
    })
}
module.exports = {
    querySql
};