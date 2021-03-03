//sql
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'blood-bank.cfa33wsn7pjo.us-east-1.rds.amazonaws.com',
  port : '3306',
  user     : 'admin',
  password : 'Akash01!',
  database: 'blood_bank_db'
});


connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});


module.exports = connection;


