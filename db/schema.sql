-- drop tables if they exist
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;
-- create new tables
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE
    SET NULL,
);
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE
    SET NULL,
);