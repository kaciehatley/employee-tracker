var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

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
    start();
  });

  function start() {
      initialQuestion()
  }

  function initialQuestion() {
    inquirer
        .prompt({
            name: "initialChoice",
            type: "list",
            message: "What would you like to do??",
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role, Update Employee Manager"]
        })
        .then(function(answer) {
            if (answer.initialChoice==="View All Employees") {
                viewEmployees(answer);
            }
            connection.end();
        })
};

function viewEmployees(answer) {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(cTable.getTable(res));
        initialQuestion();
    })
}