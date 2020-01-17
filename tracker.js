var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root123!",
    database: "tracker_db"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    inquirer
    .prompt({
        name: "initialChoice",
        type: "list",
        message: "What would you like to do??",
        choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role, Update Employee Manager"]
    })
    .then(function(answer) {
        console.log(answer);
        connection.end();
    })
  });