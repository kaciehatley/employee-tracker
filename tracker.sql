-- DROP ALL PREVIOUS DATABASES
DROP DATABASE IF EXISTS tracker_db;

-- CREATE NEW DATABASE
CREATE DATABASE tracker_db;

USE tracker_db;

-- ADD TABLES
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT NULL,
    foreign key (department_id) references department(id) on delete cascade
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NULL,
    manager_id INT,
    foreign key (role_id) references role(id) on delete cascade,
    foreign key (manager_id) references employee(id) on delete cascade
);

-- ALTER TABLE employee (
--     foreign key (role_id) references role(id) on delete cascade,
-- )