const inquirer = require('inquirer');
const fetch = require('isomorphic-fetch');
const cTable = require('console.table');

function startApp() {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: [
          'View All Departments',
          'View All Roles',
          'View All Employees',
          'Add A Department',
          'Add A Role',
          'Add An Employee',
          "Update An Employee's Role",
          'Quit',
        ],
      },
    ])
    .then(choice => {
      switch (choice.menu) {
        case 'View All Departments':
          fetch('http://localhost:3001/api/departments')
            .then(res => {
              if (!res.ok) {
                return console.log('Error ' + res.statusText);
              }
              return res.json();
            })
            .then(departmentData => {
              console.log('---------------');
              console.table('All Departments', departmentData.data);
              console.log('---------------');
            })
            .then(startApp);
          break;
        case 'View All Employees':
          fetch('http://localhost:3001/api/employees')
            .then(res => {
              if (!res.ok) {
                return console.log('Error ' + res.statusText);
              }
              return res.json();
            })
            .then(employeeData => {
              console.log(
                '---------------------------------------------------------------------------------------'
              );
              console.table('All Employees', employeeData.data);
              console.log(
                '---------------------------------------------------------------------------------------'
              );
            })
            .then(startApp);
          break;
        case 'View All Roles':
          fetch('http://localhost:3001/api/roles')
            .then(res => {
              if (!res.ok) {
                return console.log('Error ' + res.statusText);
              }
              return res.json();
            })
            .then(roleData => {
              console.log('-----------------------------------------------');
              console.table('All Roles', roleData.data);
              console.log('-----------------------------------------------');
            })
            .then(startApp);
          break;
        case 'Add A Department':
          return inquirer
            .prompt([
              {
                type: 'input',
                name: 'dept_name',
                message: 'What is the name of the new department?',
                validate: deptNameInput => {
                  if (deptNameInput) {
                    return true;
                  } else {
                    console.log('Must enter department name!');
                    return false;
                  }
                },
              },
            ])
            .then(deptName => {
              fetch('http://localhost:3001/api/department', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(deptName),
              })
                .then(response => {
                  if (response.ok) {
                    return response.json();
                  }
                  alert('Error: ' + response.statusText);
                })
                .then(postResponse => {
                  console.log(postResponse);
                  console.log('Department added');
                })
                .then(startApp);
            });
        case 'Quit':
          process.exit();
      }
    });
}

module.exports = { startApp };
