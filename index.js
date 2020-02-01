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
    

const addEmp = () => {
    
    const managerArr = [];
    const roleArr = ["1. Casheir", "2. Stockist", "3. Inventory", "4. Shift Supervisor", "5. Assistant Manager", "6. Store Manager", "7.Regional Manager"];
    const sqlQuery = `
    SELECT DISTINCT m.id, m.first_name, m.last_name, r.title
    FROM employee e
    JOIN employee m
    ON e.manager_id = m.id
    JOIN role r
    ON m.role_id = r.id`;
    // const toPush = {
    //     id: "result.id",
    //     first_name: "result.first_name",
    //     last_name: "result.last_name"
    // };
        
        // arr.push(result.id + ". " + result.first_name + " " + result.last_name + " || " + result.title);

    listQuery(sqlQuery, managerArr);
    // connection.query(`
    //         SELECT DISTINCT m.id, m.first_name, m.last_name, r.title
    //         FROM employee e
    //         JOIN employee m
    //         ON e.manager_id = m.id
    //         JOIN role r
    //         ON m.role_id=r.id`, (err, res) => {
    //     if (err) throw err;
    //     for (result of res) {
    //         managerArr.push(result.id + ". " + result.first_name + " " + result.last_name + " ---" + result.title);
    //     }
    //     // console.log("manager array ", managerArr);   
    //     return managerArr;
    // });
    
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
            choices: managerArr

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
    
    const employeeArr = [];

    connection.query(`SELECT id, first_name, last_name FROM employee;`, (err, res) => {
        if (err) throw err;
        for (result of res) {
            // console.log(result)
            employeeArr.push(result.id + ". " + result.first_name + " " + result.last_name)
        }
        // console.log(employeeArr)
        return employeeArr;
    });
    // console.log(employeeArr);   
    inquirer.prompt([
        {
            name: "employee",
            type: "list",
            message: "Which employee would you like to delete?",
            choices: employeeArr
        }
    ]).then((answer) => {
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
   


const listQuery = (query, arr) => {
    connection.query(query, (err, res) => {
        if (err) throw err;
        for (result of res) {
            // console.log(result);
            arr.push(result.id + ". " + result.last_name + " " + result.last_name);
        }
        // console.log("final array ", arr);   
        return arr;
    });
}

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