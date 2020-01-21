var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

let departments = [];
let roles = [];
let managers = [];

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
    var queryString = "SELECT employee.id, employee.first_name, employee.last_name, roleJoin.title, deptJoin.name as department, roleJoin.salary, concat(emp.first_name,' ', emp.last_name) AS manager FROM employee INNER JOIN role roleJoin on roleJoin.id = employee.role_id inner join department deptJoin on deptJoin.id = roleJoin.department_id left join employee emp on employee.manager_id = emp.id";
  
    connection.query(queryString, function (err, res) {
      if (err) throw err;
      console.table(res);
      initialQuestion();
    });
  
}

function viewDepts() {
    var queryString = "SELECT * FROM department";

    connection.query(queryString, function (err, res) {
        if (err) throw err;
        console.table(res);
        initialQuestion();
      });
};

function viewRoles() {
    var queryString = "SELECT role.id, role.title, role.salary, deptJoin.id AS department FROM role INNER JOIN department deptJoin on deptJoin.id = role.department_id";

    connection.query(queryString, function (err, res) {
        if (err) throw err;
        console.table(res);
        initialQuestion();
      });
};




function addEmployee() {
    roles=[];
    managers=[];
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        for (let i=0; i<res.length; i++) {
            roles.push(res[i].title);
        }
    });
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        for (let i=0; i<res.length; i++) {
            managers.push(res[i].first_name + " " 
            + res[i].last_name);
        }
    });
        inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?"
          },
          {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?"
          },
          {
            name: "employeeRole",
            type: "list",
            message: "What is the employee's role?",
            choices: roles
          },
          {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: managers
          }
        ]).then(function(answer) {
            console.log(answer);
            let firstN = answer.firstName;
            let lastN = answer.lastName;
            let roleID = 0;
            let manager = answer.manager.split(" ");
            let managerID = 0;

            connection.query(
            "SELECT id FROM role where ?", 
            {title: answer.employeeRole}, 
            function(err, res) {
                if (err) throw err;
                roleID = res[0].id;
                connection.query(
                    "SELECT * FROM employee WHERE ? AND ?", 
                    [{first_name: manager[0]}, {last_name: manager[1]}], 
                    function(err, res) {
                        if (err) throw err;
                        managerID = res[0].id;
                        connection.query(
                            "INSERT INTO employee SET ?", 
                            {first_name: firstN,
                            last_name: lastN,
                            role_id: roleID,
                            manager_id: managerID
                            }, 
                            function(err, res) {
                                if (err) throw err;
                                console.log(res.affectedRows + " product inserted!\n");
                            })
                    })
            })
        });
    }

function addRole() {
    departments=[];
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        for (let i=0; i<res.length; i++) {
            departments.push(res[i].name);
        }
    });
    inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the role?"
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of the role?"
      },
      {
        name: "deptID",
        type: "list",
        message: "Which department does this role work in?",
        choices: departments
      }
    ]).then(function(answer) {
        let roleTitle = answer.title;
        let roleSalary = answer.salary;
        let deptName = answer.deptID;
        let deptID = 0;

        connection.query("SELECT id FROM department WHERE ?", {name: deptName}, function(err, res) {
            if (err) throw err;
            deptID = res[0].id;

            connection.query(
                "INSERT INTO role SET ?", 
                {title: roleTitle,
                salary: roleSalary,
                department_id: deptID
                }, 
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " product inserted!\n");
                })
        });
    })
}

function addDept() {
    inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What department would you like to add?"
      }
    ]).then(function(answer) {
        connection.query(
            "INSERT INTO department SET ?", 
            {name: answer.name}, 
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " product inserted!\n");
            })
    })
}

  // First question asked to user
  function initialQuestion() {
    inquirer
        .prompt({
            name: "initialChoice",
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Departments", "View All Roles", "Add Employee", "Add Role", "Add Department", "Update Employee Role"]
        })
        .then(function(answer) {
            switch(answer.initialChoice) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "View All Departments":
                    viewDepts();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "Add Employee":
                    addEmployee()
                    break;
                case "Add Role":
                    addRole()
                    break;
                case "Add Department":
                    addDept()
                    break;
                default:
                    initialQuestion();
              }
        })
};

// function removeEmployee() {
    //     // Variables storing names of ALL employees and the id of which employee is selected
    //     let employeeNames = [];
    //     let selectedEmployee = 0;
    
    //     connection.query(
    //         "SELECT * FROM employee", 
    //         function(err, res) {
    //             if (err) throw err; 
    //             // Loop pushes each stored first and last name of employees to employeeNames array
    //             for (var i=0; i < res.length; i++) {
    //                 employeeNames.push(`${res[i].first_name} ${res[i].last_name}`);
    //                 }
    //             inquirer
    //                 // User selects which employee they would like to remove
    //                 .prompt({
    //                     name: "employeeName",
    //                     type: "list",
    //                     message: "Which employee would you like to remove?",
    //                     choices: employeeNames
    //                 })
    //                 .then(function(answer) {
    //                     // Loops through first and last names in db to find all info on the employee name they selected
    //                     for (var j=0; j < res.length; j++) {
    //                         if (answer.employeeName === `${res[j].first_name} ${res[j].last_name}`) {
    //                             // then sets variable equal to that employee's id
    //                             selectedEmployee = res[j].id;
    //                         }
    //                     }
    //                     connection.query(
    //                         // Deletes the employee by id
    //                         "DELETE FROM employee WHERE ?",
    //                         {
    //                         id: selectedEmployee
    //                         },
    //                         function(err, res) {
    //                           if (err) throw err;
    //                           console.log("Removed employee from database");
    //                           initialQuestion();
    //                         }
    //                       );
    //                 })
    //             }
    //     )
    
    // }