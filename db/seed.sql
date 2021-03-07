USE manageTeam_DB;


INSERT INTO department (name)
VALUE ('Sales');

INSERT INTO department (name)
VALUE ('Engineering');

INSERT INTO department (name)
VALUE ('Finance');

INSERT INTO department (name)
VALUE ('Legal');

INSERT INTO role (title, salary, department_id)
VALUE ('Sales Lead', 100000, 1);

INSERT INTO role (title, salary, department_id)
VALUE ('Salesperson', 80000, 1);

INSERT INTO role (title, salary, department_id)
VALUE ('Lead Engineer', 150000, 2);

INSERT INTO role (title, salary, department_id)
VALUE ('Software Engineer', 120000, 2);

INSERT INTO role (title, salary, department_id)
VALUE ('Accountant', 125000, 3);

INSERT INTO role (title, salary, department_id)
VALUE ('Legal Team Lead', 250000, 4);

INSERT INTO role (title, salary, department_id)
VALUE ('Lawyer', 190000, 4);

INSERT INTO manager (manager)
VALUE ('Kurtis Doggo');

INSERT INTO manager (manager)
VALUE ('Alex Jackson');

INSERT INTO manager (manager)
VALUE ('Roger Smith');

INSERT INTO manager (manager)
VALUE ('Peter Griffin');

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Iyana","Medlock", 1, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("John","Doe", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Micheal","Jordan", 1,2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("George","Washington", 3,1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Elon","Musk", 3, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Ham","Boogie", 1, 2);    

SELECT id FROM manager WHERE (manager.manager = 'Kurtis Doggo')