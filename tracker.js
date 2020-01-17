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

// Starts application
  function start() {
      initialQuestion()
  }


// All functions that correspond with what the initial question
function viewEmployees() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement in the employees table
        console.log(cTable.getTable(res));
        initialQuestion();
    })
}

function removeEmployee() {
    // Variables storing names of ALL employees and the id of which employee is selected
    let employeeNames = [];
    let selectedEmployee = 0;

    connection.query(
        "SELECT * FROM employee", 
        function(err, res) {
            if (err) throw err; 
            // Loop pushes each stored first and last name of employees to employeeNames array
            for (var i=0; i < res.length; i++) {
                employeeNames.push(`${res[i].first_name} ${res[i].last_name}`);
                }
            inquirer
                // User selects which employee they would like to remove
                .prompt({
                    name: "employeeName",
                    type: "list",
                    message: "Which employee would you like to remove?",
                    choices: employeeNames
                })
                .then(function(answer) {
                    // Loops through first and last names in db to find all info on the employee name they selected
                    for (var j=0; j < res.length; j++) {
                        if (answer.employeeName === `${res[j].first_name} ${res[j].last_name}`) {
                            // then sets variable equal to that employee's id
                            selectedEmployee = res[j].id;
                        }
                    }
                    connection.query(
                        // Deletes the employee by id
                        "DELETE FROM employee WHERE ?",
                        {
                        id: selectedEmployee
                        },
                        function(err, res) {
                          if (err) throw err;
                          console.log("Removed employee from database");
                          initialQuestion();
                        }
                      );
                })
            }
    )

}

  // First question asked to user
  function initialQuestion() {
    inquirer
        .prompt({
            name: "initialChoice",
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager"]
        })
        .then(function(answer) {
            switch(answer.initialChoice) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "Remove Employee":
                    removeEmployee()
                    break;
                default:
                    initialQuestion();
              }
        })
};