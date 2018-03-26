var mysql = require('mysql');

//Put your mysql configuration settings - user, password, database and port

let pool = mysql.createPool({
    host            : 'localhost',
    user            : 'root',
    password        : 'root',
    database        : 'freelancerdb',
    port	 : 3306,
    connectionLimit : 10
});

function fetchData(callback,sqlQuery){
    console.log("\nSQL Query::"+sqlQuery);
    pool.getConnection(function (err, connection) {
        connection.query(sqlQuery, function(err, rows, fields) {
            if(err){
                console.log("ERROR: " + err.message);
            } else {
                // return err or result
                console.log("DB Results:"+rows);
            }
            console.log("\nConnection closed..");
            connection.release();
            callback(err, rows);
        });
    });
}
exports.fetchData=fetchData;


