require("dotenv").config();
const mysql = require("mysql2");
const inquirer = require("inquirer");
var req = "";
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "manageTeam_DB",
});

connection.connect((err) => {
  if (err) throw err;
  start();
});

const start = () => {
  inquirer
    .prompt({
      name: "welcome",
      type: "list",
      message: "Select an option",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "Add Role",
        "Remove Role",
        "Add Department",
        "Remove Departments",
        "View Managers",
        "Add Manager",
        "Remove Manager",
        "EXIT"
      ],
    })
    .then((answer) => {
      switch (answer.welcome) {
        case "View All Employees":
          viewAll();
          break;
        case "View All Employees By Department":
          viewDep();
          break;
        case "View All Employees By Manager":
          viewManager();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
            removeEmployee();
            break;
        case "Update Employee Role":
            updateEmployee();
            break;
        case "Update Employee Manager":
            updateManager();
            break;
        case "View All Roles":
            viewRoles();
            break;
        case "Add Role":
            addRoles();
            break;
        case "Remove Role":
            removeRole();
            break;
        case "Add Department":
            addDep();
            break;
        case "Remove Department":
            removeDep();
            break;
        case "View Managers":
            viewMan();
            break;
        case "Add Manager":
            addManager();
            break;
        case "Remove Manager":
            removeManager();
            break
        default:
            connection.end();
            break;

      }
    });
};

const removeManager = () => {
    connection.query("SELECT manager.manager FROM manager", (err, res) => {
        if (err) throw err;
    
        inquirer
          .prompt([
            {
              name: "manager",
              type: "rawlist",
              choices() {
                const choiceArray = [];
                res.forEach(({ manager }) => {
                  choiceArray.push(manager);
                });
                return choiceArray;
              },
              message: "Select a Manager",
            },
          ])
          .then((answer) => {
            console.log(answer.manager);
            connection.query(
                `DELETE FROM manager WHERE manager.manager = "${answer.manager}"`,
              (err, res) => {
                if (err) throw err
            console.log("Manager deleted");
            viewMan();
              }
            );
          });
      });
}

const addManager = () => {
    inquirer.prompt(
        {
            name: 'manager',
            type: 'input',
            message: "New Manager first name and last name?",
            validate(value) {
                if (value.length === 0) {
                  return false;
                }
                return true;
              },

        }
    ).then((answer) => {
        connection.query(`INSERT INTO manager (manager) VALUE ("${answer.manager}")`,(err) => {
            if (err) throw err
            console.log("New manager added");
            viewMan();
        })
    })
}

const viewMan = () => {
    connection.query("SELECT * FROM manager", (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
}

const removeDep = () => {
    connection.query("SELECT department.name FROM department", (err, res) => {
        if (err) throw err;
    
        inquirer
          .prompt([
            {
              name: "depName",
              type: "list",
              choices() {
                const choiceArray = [];
                res.forEach(({ name }) => {
                  choiceArray.push(name);
                });
                return choiceArray;
              },
              message: "Select a department",
            },
          ]).then((answer) => {
            connection.query(`DELETE FROM department WHERE department.name = "${answer.depName}"`, (err, res) => {
                console.log('Department deleted!');
                viewAll();
                
            })
        })
      });
}

const addDep = () => {
    inquirer.prompt(
        {
            name: 'depName',
            type: 'input',
            message: "Department name?",
            validate(value) {
                if (value.length === 0) {
                  return false;
                }
                return true;
              },

        }).then((answer) => {
            connection.query(`INSERT INTO department (name) VALUE ("${answer.depName}")`,(err) => {
                if (err) throw err
                console.log("New Departments added");
                viewAll();
            })
        })
}

const viewAll = () => {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager.manager FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role_id = department.id) INNER JOIN manager ON (employee.manager_id = manager.id)",
    (err, results) => {
      if (err) throw err;
      console.table(results);
      start();
    }
  );
};

const removeRole = () => {
    connection.query("SELECT role.title FROM role", (err, res) => {
        if (err) throw err;
    
        inquirer
          .prompt([
            {
              name: "roles",
              type: "list",
              choices() {
                const choiceArray = [];
                res.forEach(({ title }) => {
                  choiceArray.push(title);
                });
                return choiceArray;
              },
              message: "Select a role",
            },
          ])
          .then((answer) => {
            connection.query(
              `DELETE FROM role WHERE role.title = "${answer.roles}"`,
              (err, res) => {
                console.log('Role deleted!');
                viewAll();
              }
            );
          });
      });
}

const addRoles = () => {
    connection.query("SELECT department.name FROM department", (err, res) => {
        if (err) throw err;
    
        inquirer
          .prompt([
             {
            name: "roleName",
            type: "input",
            message: "New Role name?",
            validate(value) {
                if (value.length === 0) {
                  return false;
                }
                return true;
              },

        },{
            name: "salary",
            type: "number",
            message: "Salary of this role?",
            validate(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              },

        } ,
            {
              name: "depName",
              type: "list",
              choices() {
                const choiceArray = [];
                res.forEach(({ name }) => {
                  choiceArray.push(name);
                });
                return choiceArray;
              },
              message: "Select a department",
            },
          ]).then((answer) => {
            connection.query(
                `SELECT * FROM department WHERE department.name = "${answer.depName}"`,
                (err, rs) => {
                  if (err) throw err;
                  req = `INSERT INTO role (title, salary, department_id) value ("${answer.roleName}", ${answer.salary},${rs[0].id})`
                  addR(req);
                }
              );
        })
      });
    };
    
    const addR = (x) => {
        connection.query(x, (err) => {
            if (err) throw err;
            console.log('New Role added!')
            viewAll();
        })
    }
        

const viewRoles = () => {
    connection.query("SELECT role.title FROM role", (err, res) => {
        if (err) throw err;
    
        inquirer
          .prompt([
            {
              name: "roles",
              type: "list",
              choices() {
                const choiceArray = [];
                res.forEach(({ title }) => {
                  choiceArray.push(title);
                });
                return choiceArray;
              },
              message: "Select a role",
            },
          ])
          .then((answer) => {
            connection.query(
              `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager.manager FROM employee INNER JOIN department ON (employee.role_id = department.id) INNER JOIN role ON (role_id = role.id) INNER JOIN manager ON (employee.manager_id = manager.id) WHERE role.title = "${answer.roles}"`,
              (err, res) => {
                console.table(res);
                start();
              }
            );
          });
      });
}

const viewDep = () => {
  connection.query("SELECT department.name FROM department", (err, res) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "depName",
          type: "list",
          choices() {
            const choiceArray = [];
            res.forEach(({ name }) => {
              choiceArray.push(name);
            });
            return choiceArray;
          },
          message: "Select a department",
        },
      ])
      .then((answer) => {
        connection.query(
          `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager.manager FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role_id = department.id) INNER JOIN manager ON (employee.manager_id = manager.id) WHERE department.name = "${answer.depName}"`,
          (err, res) => {
            console.table(res);
            start();
          }
        );
      });
  });
};

const addEmployee = () => {
  var newEmployee = [];
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "First name?",
          validate(value) {
            if (value.length === 0) {
              return false;
            }
            return true;
          },
        },
        {
          name: "lastName",
          type: "input",
          message: "Last name?",
          validate(value) {
            if (value.length === 0) {
              return false;
            }
            return true;
          },
        },
        {
          name: "depName",
          type: "list",
          choices() {
            const choiceArray = [];
            res.forEach(({ name }) => {
              choiceArray.push(name);
            });
            return choiceArray;
          },
          message: "Select a department",
        },
      ])
      .then((answer) => {
        newEmployee.push(answer);
        connection.query(
          `SELECT * FROM department WHERE department.name = "${answer.depName}"`,
          (err, rs) => {
            if (err) throw err;
            req = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUE ("${answer.firstName}","${answer.lastName}", ${rs[0].id},`
          }
        );
      })
      .then(() => {
        connection.query("SELECT * FROM manager", (err, rs) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                name: "manager",
                type: "rawlist",
                choices() {
                  const choiceArray = [];
                  rs.forEach(({ manager }) => {
                    choiceArray.push(manager);
                  });
                  return choiceArray;
                },
                message: "Select a Manager",
              },
            ])
            .then((results) => {
              connection.query(
                `SELECT id FROM manager WHERE manager.manager = "${results.manager}"`,
                (err, ko) => {
                  if (err) throw err;
                  req += `${ko[0].id})`
                  adding(req)
                }
              );
            })
        });
      });
  });
};

const adding = (x) => {
    connection.query(x, (err) => {
        if (err) throw err;
        console.log('New Employee added!')
        viewAll();
    })
}

const removeEmployee = () => {
    connection.query("SELECT employee.first_name, employee.last_name FROM employee", (err, res) => {
        if (err) throw err;

        inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          choices() {
            const choiceArray = [];
            res.forEach(({ first_name }) => {
                
              choiceArray.push(first_name);
            });
            return choiceArray;
          },
          message: "Select an employee",
        },
      ])
      .then((answer) => {
        connection.query(`DELETE FROM employee WHERE employee.first_name = "${answer.employee}"`, (err, res) => {
            console.log('Employee deleted!');
            viewAll();
        })
      });
    })
}

const viewManager = () => {
  connection.query("SELECT manager.manager FROM manager", (err, res) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "manager",
          type: "rawlist",
          choices() {
            const choiceArray = [];
            res.forEach(({ manager }) => {
              choiceArray.push(manager);
            });
            return choiceArray;
          },
          message: "Select a Manager",
        },
      ])
      .then((answer) => {
        console.log(answer.manager);
        connection.query(
          `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager.manager FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role_id = department.id) INNER JOIN manager ON (employee.manager_id = manager.id) WHERE manager.manager = "${answer.manager}"`,
          (err, res) => {
            console.table(res);
            start();
          }
        );
      });
  });
};

var name = ''
const updateEmployee = () => {
    connection.query("SELECT employee.first_name, employee.last_name FROM employee", (err, res) => {
        if (err) throw err;

        inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          choices() {
            const choiceArray = [];
            res.forEach(({ first_name }) => {
                
              choiceArray.push(first_name);
            });
            return choiceArray;
          },
          message: "Select an employee",
        },
      ])
      .then((answer) => {
          name = answer.employee;
        connection.query("SELECT * FROM role", (err, res) => {
            if (err) throw err;
            inquirer
          .prompt([
            {
              name: "role",
              type: "list",
              choices() {
                const choiceArray = [];
                res.forEach(({ title }) => {
                    
                  choiceArray.push(title);
                });
                return choiceArray;
              },
              message: "Select a role",
            },
          ]).then((answer) => {
              connection.query(`SELECT id FROM role WHERE role.title = "${answer.role}"`, (err,res) => {
                req = `UPDATE employee SET role_id = ${res[0].id} WHERE first_name = "${name}"`
                update(req);
              })
          })
        })
      });
    })
}


const update = (x) => {
    connection.query(x, (err) => {
        if (err) throw err;
        console.log('Updated!')
        viewAll();
    })
}

const updateManager = () =>{
    connection.query("SELECT employee.first_name, employee.last_name FROM employee", (err, res) => {
        if (err) throw err;

        inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          choices() {
            const choiceArray = [];
            res.forEach(({ first_name }) => {
                
              choiceArray.push(first_name);
            });
            return choiceArray;
          },
          message: "Select an employee",
        },
      ])
      .then((answer) => {
          name = answer.employee;
        connection.query("SELECT * FROM manager", (err, res) => {
            if (err) throw err;
            inquirer
          .prompt([
            {
              name: "manager",
              type: "list",
              choices() {
                const choiceArray = [];
                res.forEach(({ manager }) => {
                    
                  choiceArray.push(manager);
                });
                return choiceArray;
              },
              message: "Select a Manager",
            },
          ]).then((answer) => {
              connection.query(`SELECT id FROM manager WHERE manager.manager = "${answer.manager}"`, (err,res) => {
                req = `UPDATE employee SET manager_id = ${res[0].id} WHERE first_name = "${name}"`
                update(req);
              })
          })
        })
      });
    })
}