--the right way I THINK now that I used foreign keys to reference other ids
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kathy", "Bates", 1, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Betty", "Davis", 5, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("John", "Gacy", 6, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("George", "Clinton", 7, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Aileen ", "Wuornos", 1, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ted", "Kaczynski", 4, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ron", "Hubbard", 2, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Henry", "Ford", 3, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ottis", "Toole", 2, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Luca", "Magnotta", 1, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jenny", "Jones", 1, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Lana", "Turner", 4, 2);


--the wrong way
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kathy", "Bates", 1, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Betty", "Davis", 5, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("John", "Gacy", 6, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("George", "Clinton", 7, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Aileen ", "Wuornos", 1, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ted", "Kaczynski", 4, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ron", "Hubbard", 2, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Henry", "Ford", 3, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ottis", "Toole", 2, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Luca", "Magnotta", 1, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jenny", "Jones", 1, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Lana", "Turner", 4, 5);


INSERT INTO role (title, salary, department_id) VALUES ("Cashier", "30000.00", 1);
INSERT INTO role (title, salary, department_id) VALUES ("Stockist", "32000.00", 2);
INSERT INTO role (title, salary, department_id) VALUES ("Inventory", "33000.00", 2);
INSERT INTO role (title, salary, department_id) VALUES ("Shift Supervisor", "35000.00", 3);
INSERT INTO role (title, salary, department_id) VALUES ("Assistant Manager", "45000.00", 3);
INSERT INTO role (title, salary, department_id) VALUES ("Store Manager", "65000.00", 3);
INSERT INTO role (title, salary, department_id) VALUES ("Regional Manager", "95000.00", 3);

INSERT INTO department (name) VALUES ("Sales");
INSERT INTO department (name) VALUES ("Inventory");
INSERT INTO department (name) VALUES ("Management");
