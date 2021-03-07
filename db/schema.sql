DROP DATABASE IF EXISTS manageTeam_DB;

CREATE DATABASE manageTeam_DB;

USE manageTeam_DB;

	 CREATE TABLE department(
	id INT auto_increment NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);
CREATE TABLE manager(
	id INT auto_increment NOT NULL,
	name VARCHAR(30),
   PRIMARY KEY (id)
);
CREATE TABLE role(
	id INT auto_increment NOT NULL,
    title VARCHAR(30),
    salary FLOAT,
    department_id INT,
    PRIMARY KEY (id),
    foreign key (department_id) references department(id)
);

CREATE TABLE employee(
	id INT auto_increment NOT NULL,
   first_name VARCHAR(30),
   last_name VARCHAR(30),
   role_id INT,
   manager_id INT,
   FOREIGN KEY(role_id)
   references role(id), 
   FOREIGN KEY (manager_id)
   REFERENCES manager(id),
   PRIMARY KEY (id)
);

SELECT * FROM employee;
