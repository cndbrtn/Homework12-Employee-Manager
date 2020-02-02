const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "butts",
    database: "employee_trackerDB"
})

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log(`connected as id ${connection.threadId}`);
    const welcomeTxt = `
---------------------------------------------------------------
####### #     # ######  #       ####### #     # ####### #######    
#       ##   ## #     # #       #     #  #   #  #       #          
#       # # # # #     # #       #     #   # #   #       #          
#####   #  #  # ######  #       #     #    #    #####   #####      
#       #     # #       #       #     #    #    #       #          
#       #     # #       #       #     #    #    #       #          
####### #     # #       ####### #######    #    ####### #######    
                                                                   
    ####### ######     #     #####  #    # ####### ######  
       #    #     #   # #   #     # #   #  #       #     # 
       #    #     #  #   #  #       #  #   #       #     # 
       #    ######  #     # #       ###    #####   ######  
       #    #   #   ####### #       #  #   #       #   #   
       #    #    #  #     # #     # #   #  #       #    #  
       #    #     # #     #  #####  #    # ####### #     # 
---------------------------------------------------------------
    `
    console.log("\x1b[34m", welcomeTxt)
    start();

});


const start = () => {

    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices:
            [
            "View All Employees", "View All Employees By Department", "View All Employees By Role",
            "View All Employees by Manager", "Add Employee", "Remove Employee", "Update Employee",
            "View All Roles", "Add Role", "Remove Role",
            "View All Departments", "Add Department", "Remove Department"
            ]
    }).then((choice) => {
        // console.table(choice);
        if (choice.menu === "View All Employees") allEmployees();
        if (choice.menu === "View All Employees By Department") allEmpByDept();
        if (choice.menu === "View All Employees By Role") allEmpByRole();
        if (choice.menu === "View All Employees by Manager") allEmpByMan();
        if (choice.menu === "Add Employee") addEmp();
        if (choice.menu === "Remove Employee") deleteEmp();
        if (choice.menu === "Update Employee") updateEmp();
        if (choice.menu === "View All Roles") allEmpByRole();
        if (choice.menu === "Add Role") allEmpByRole();
        if (choice.menu === "Remove Role") allEmpByRole();
        if (choice.menu === "View All Departments") allEmpByRole();
        if (choice.menu === "Add Department") allEmpByRole();
        if (choice.menu === "Remove Department") allEmpByRole();
       
    })
}


const allEmployees = () => {
    // this is where we show all the employees by querying the mySQL database
    connection.query(`
    SELECT 
    e.id, e.first_name AS 'first name', e.last_name AS 'last name', r.title AS 'position', r.salary, CONCAT(m.first_name, " ", m.last_name) AS 'manager name'
    FROM employee e
    LEFT JOIN employee m
    ON m.id = e.manager_id
    INNER JOIN role r
    ON r.id = e.role_id
    JOIN department d
    ON r.department_id = d.id;`, (err, res) => {
        consoleResult(err, res);
    });
}

const allEmpByDept = () => {
    // this is where we get all employee names and their assigned department

    /*the instructions for this project were very very vague as far as what was expected for "view department" and "view manager"
      am I being asked to just show all the employees and their departments? all employees and their managers? or am I meant to sort
      everything so that I'm displaying ONLY employees in a certain department or managed by a certain person? if I had a client I could
      ask them what they wanted but my client is just a readme file. I couldn't figure out how to query the database to get ONLY employees
      by certain manager or department. I'm sure there's a way but I couldn't figure it out and because the assignment is so vague as to 
      what it actually expects out of me this is what I cam up with for the "display all by manager", and "display all by department"  */
    connection.query(`
    SELECT e.id, e.first_name AS 'first name', e.last_name AS 'last name', d.name AS 'department'
    FROM employee e
    JOIN role r
    ON r.id=e.role_id
    JOIN department d
    ON d.id=r.department_id;`, (err, res) => {
        consoleResult(err, res);
    });
}



    // 'SELECT * FROM department; `, (err, res) => {
    //         if (err) throw err;
    //         const depts = res;
    //         console.log(depts)

    //         const departments = depts.map(obj => {
    //             let newObj = {};
    //             newObj = { 
    //                 name: obj.name,
    //                 value: {
    //                     id: obj.id,
    //                     name: obj.name
    //                 }
    //             }
    //             return newObj;
    //         })
    //         // consoleResult(err, res);
    //         inquirer.prompt({
    //             name: "department",
    //             type: "list",
    //             message: "Which department would you like to view?",
    //             choices: departments
    //         }).then(answer => {
    //             console.log(answer.department)
                
    //                 connection.query(`
    // SELECT e.first_name, e.last_name, d.name
    // FROM employee e
    // JOIN role r
    // JOIN department d
    // ON r.department_id = d.id`, (err, res) => {
    //                         if (err) throw err;
    //                         console.log(res)
    //                         const resArr = res;
    //                         if (answer.department.id === 1) {

                        

                            // }
    //                 })
        // })
//     });
// }

const allEmpByRole = () => {
    // this is where we get all employee names and their role
    connection.query(`
    SELECT e.id, e.first_name AS 'first name', e.last_name AS 'last name', r.title AS 'position'
    FROM employee e
    JOIN role r
    ON r.id=e.role_id;`, (err, res) => {
        consoleResult(err, res);
    });
}

const allEmpByMan = () => {
    // this is where we get all employee names and their role
    connection.query(`
    SELECT e.id, e.first_name AS 'first name', e.last_name AS 'last name', CONCAT(m.first_name, m.last_name) AS 'manager name'
    FROM employee e
    JOIN employee m
    ON m.id=e.manager_id;`, (err, res) => {
        consoleResult(err, res);
    });
}

    

const addEmp = () => {
    
    const managerArr = ["0. None"];
    const roleArr = [];

    const sqlQuery1 = `
    SELECT DISTINCT m.id, m.first_name, m.last_name, r.title
    FROM employee e
    JOIN employee m
    ON e.manager_id = m.id
    JOIN role r
    ON m.role_id = r.id`;

    const sqlQuery2 = `SELECT id, title FROM role`;

    // const toPush = result.id + ". " + result.first_name + " " + result.last_name;

    console.log(listQuery(sqlQuery1))

    roleListQuery(sqlQuery2, roleArr)
    // for adding new employees
    inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter employee's first name:",
            validate: validator
        },
        {
            name: "last",
            type: "input",
            message: "Enter employee's last name:",
            validate: validator
        },
        {
            name: "role",
            type: "list",
            message: "What is their role in the company?",
            choices: roleArr
        },
        {
            name: "manager",
            type: "list",
            message: "Who manages new employee?",
            choices: listQuery(sqlQuery1)


        }]).then((answer) => {
            // console.log(answer.manager)
            let role = answer.role;
            let manager = answer.manager;
            if (manager != null) {
                role = parseInt(role.charAt(0));
                manager = parseInt(manager.charAt(0));
            } else {
                manager = null;
            }

            const newEmployee = {
                first_name: answer.first,
                last_name: answer.last,
                role_id: role,
                manager_id: manager
            }
        
            // console.table(newEmployee)
            // if (role === "")
            connection.query(`INSERT INTO employee SET ? `, newEmployee, (err, res) => {
                if (err) throw err;
                // console.log(res)
                    allEmployees();
            })
        });
}

const deleteEmp = () => {
  // this is where we delete employees/roles/departments
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        const empArr = res.map(obj => {
            let newObj = {
                name: obj.id + ". " + obj.first_name + " " + obj.last_name,
                value: {
                    id: obj.id,
                    first_name: obj.first_name,
                    last_name: obj.last_name
            }};
            // newObj[obj.id] = obj.first_name + " " + obj.last_name; 
            return newObj;
        })
        // console.log(empArr)

        inquirer.prompt({
            name: "employee",
            type: "list",
            message: "Which employee would you like to delete?",
            choices: empArr
        }).then((answer) => {
            const id = answer.employee.id;
            console.log(id);
            connection.query(`DELETE FROM employee WHERE id=?`, [id], (err, res) => {
                if (err) throw err;
                // console.log(res);
                allEmployees();
            })
        });
    })
}

const updateEmp = () => {
    connection.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;

        const resArr = res;
        const updateEmpArr = resArr.map(obj => {
            let newObj = {
                name: obj.id + ". " + obj.first_name + " " + obj.last_name,
                value: {
                    id: obj.id,
                    first_name: obj.first_name,
                    last_name: obj.last_name,
                    role_id: obj.role_id,
                    manager_id: obj.manager_id
                }
            }
            return newObj;
        })

        inquirer.prompt([
            {
                name: "employee",
                type: "list", 
                message: "Which employee would you like to update?",
                choices: updateEmpArr
            },
            {
                name: "update",
                type: "list",
                message: "What would you like to update?",
                choices: ["Name", "Role", "Department", "Manager"]
            }
        ]).then(answer => {
            if (answer.update === "Name") {
                const empId = answer.employee.id
                inquirer.prompt([
                    {
                        name: "firstName",
                        type: "input",
                        message: "Update employee first name"
                    },
                    {
                        name: "lastName",
                        type: "input",
                        message: "Update employee last name"
                    }
                ]).then(answer2 => {
                    console.log(empId);
                    console.log(answer2.firstName + " " + answer2.lastName)

                    const newEmpName = {
                        first_name: answer2.firstName,
                        last_name: answer2.lastName
                    }
                    connection.query(`
                    UPDATE employee
                    SET ?
                    WHERE id =?`, [newEmpName, empId], (err, res) => {
                            if (err) throw err;
                            console.log(Employee Name Successfully Updated!)
                            allEmployees();
                    })
                })
            }
            // if (answer.update === "Role") {
                
            // }
            // if (answer.update === "Department") {
                
            // }
            // else {
                
            // }
        })
    })
}

    const consoleResult = (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
}
   
// // trying to condense
// const  listQuery = (query, arr) => {
    
//     connection.query(query, (err, res) => {
//         // const array = [];
//         if (err) throw err;
//         // console.log(res)
//         for (var i = 0; i < res.length; i++) {
//             // console.log(result);
//             arr.push(res[i].first_name + res[i].last_name);
//         }

//         // console.log("final array ", array);
//         return arr;
//     });
    
// }

// const roleListQuery = (query, arr) => {
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         for (result of res) {
//             // console.log(result);
//             arr.push(result.id + ". " + result.title);
//         }
//         // console.log("final array ", arr);   
//         return arr;
//     });
// }

// const empListQuery = (query, arr) => {
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         for (result of res) {
//             // console.log(result);
//             arr.push(result.id + ". " + result.first_name + " " + result.last_name);
//         }
//         // console.log("final array ", arr);   
//         return arr;
//     });
// }

const validator = function (input) {
    // return input !== '' || "Name must be letters only";
    const letters = /^[A-Za-z]+$/;
    if (input.match(letters)) {
        console.log(`  SUCCESS  !!!  Added new name: ${input}`)
        return true;
    } else {
        console.log("  ERROR  !!!  Your input can only contain upper and lower case letters, please try again")
        return false;
    }
}
// result.id + ". " + result.last_name + " " + result.last_name

// const validater = () => {
//     validate: (input) => {
//         const letters = /^[A-Za-z]+$/;

        
//         if (input.value.match(letters)) {
//             console.log(`Successfully added new first name: ${input}`)
//             return true;
//         }
//         console.log("Your input can only contain upper and lower case letters")
//         return false;
//     }
// }

// const employeeList = function () {
    
// }