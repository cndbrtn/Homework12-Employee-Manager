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
            "View All Employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role",
            "Update Employee Manager", "View All Roles", "Add Role", "Remove Role",
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
        if (choice.menu === "Update Employee Role") allEmpByRole();
        if (choice.menu === "Update Employee Manager") allEmpByRole();
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
    
    const empArr = [];
    const sqlQuery = `SELECT id, first_name, last_name FROM employee;`;
    // this function works just fine in addEmp() but for some reason will not return the array here
    const result = listQuery(sqlQuery);
    console.log(result)
    // console.log(empArr)

    inquirer.prompt(
        {
            name: "employee",
            type: "list",
            message: "Which employee would you like to delete?",
            choices: listQuery(sqlQuery)
        },
    ).then((answer) => {
        let id = answer.employee;
        id = parseInt(id.charAt(0));
        console.log(id);

        connection.query(`DELETE FROM employee WHERE id=?`, [id], (err, res) => {
            if (err) throw err;
            console.log(res);
            allEmployees();
            })
        })
    // this is where we delete employees/roles/departments
    }

    const consoleResult = (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
}
   
// trying to condense
const listQuery = (query) => {
    const array = [];
    connection.query(query, (err, res) => {
        if (err) throw err;
        // console.log(res)
        for (result of res) {
            // console.log(result);
            array.push(result.id + ". " + result.first_name + " " + result.last_name);
        }
    });
    
    console.log("final array ", array);   
    return array;
}

const roleListQuery = (query, arr) => {
    connection.query(query, (err, res) => {
        if (err) throw err;
        for (result of res) {
            // console.log(result);
            arr.push(result.id + ". " + result.title);
        }
        // console.log("final array ", arr);   
        return arr;
    });
}

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