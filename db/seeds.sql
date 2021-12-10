INSERT INTO department (dept_name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Manager', 95000, 1),
('Salesperson', 75000, 1),
('Lead Software Engineer', 150000, 2),
('Software Engineer', 110000, 2),
('Account Manager', 140000, 3),
('Accountant', 120000, 3),
('Legal Team Lead', 180000, 4),
('Lawyer', 175000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, NULL),
('Katie', 'Osborn', 2, 1),
('Darren', 'Dillard', 2, 1),
('Steve', 'Smith', 3, NULL),
('Chloe', 'Newton', 4, 3),
('Timothy', 'Lugo', 4, 3),
('Zach', 'Davis', 5, NULL),
('Laura', 'Woodcock', 6, 5),
('Jenna', 'Wilks', 6, 5),
('Lindsay', 'Johnson', 7, NULL),
('Roger', 'Shannon', 8, 7),
('Teddie', 'Kirby', 8, 7);
