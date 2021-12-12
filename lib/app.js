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
        case 'Add A Role':
          fetch('http://localhost:3001/api/departments')
            .then(response => {
              if (!response.ok) {
                return console.log('Error: ' + response.statusText);
              }
              return response.json();
            })
            .then(departmentData => {
              const deptsArray = [];

              for (let i = 0; i < departmentData.data.length; i++) {
                deptsArray.push(departmentData.data[i].dept_name);
              }

              return deptsArray;
            })
            .then(deptsArray => {
              return inquirer.prompt([
                {
                  type: 'input',
                  name: 'title',
                  message: 'What is the name of the new role?',
                  validate: roleNameInput => {
                    if (roleNameInput) {
                      return true;
                    } else {
                      console.log('Must enter role name!');
                      return false;
                    }
                  },
                },
                {
                  type: 'number',
                  name: 'salary',
                  message: 'What is the salary for this role?',
                  validate: salaryInput => {
                    if (salaryInput) {
                      return true;
                    } else {
                      console.log('Must enter salary!');
                      return false;
                    }
                  },
                },
                {
                  type: 'list',
                  name: 'department_id',
                  message: 'Which department does this role belong to?',
                  choices: deptsArray,
                },
              ]);
            })
            .then(async roleObject => {
              const deptIdResponse = await fetch(
                'http://localhost:3001/api/department/' +
                  roleObject.department_id
              );

              if (!deptIdResponse.ok) {
                return console.log('Error: ' + deptIdResponse.statusText);
              } else {
                const deptIdData = await deptIdResponse.json();

                const deptId = deptIdData.data[0].id;

                roleObject.department_id = deptId;
              }

              return roleObject;
            })
            .then(roleObject => {
              fetch('http://localhost:3001/api/role', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(roleObject),
              })
                .then(response => {
                  if (response.ok) {
                    return response.json();
                  }
                  alert('Error: ' + response.statusText);
                })
                .then(postResponse => {
                  console.log(postResponse);
                  console.log('Role has been added');
                })
                .then(startApp);
            });
          break;
        case 'Add An Employee':
          const rolesArray = [];
          const managersArray = [];
          fetch('http://localhost:3001/api/roles')
            .then(response => {
              if (!response.ok) {
                return console.log('Error: ' + response.statusText);
              }
              return response.json();
            })
            .then(roleData => {
              for (let i = 0; i < roleData.data.length; i++) {
                rolesArray.push(roleData.data[i].title);
              }
              fetch('http://localhost:3001/api/employees')
                .then(response => {
                  if (!response.ok) {
                    return console.log('Error: ' + response.statusText);
                  }
                  return response.json();
                })
                .then(managerData => {
                  for (let i = 0; i < managerData.data.length; i++) {
                    managersArray.push(managerData.data[i].manager);
                  }

                  const employeeData = [rolesArray, managersArray];
                  return employeeData;
                })
                .then(employeeData => {
                  const questions = [
                    {
                      type: 'input',
                      name: 'first_name',
                      message: "What is your new employee's first name?",
                      validate: firstNameInput => {
                        if (firstNameInput) {
                          return true;
                        } else {
                          console.log("Must enter employee's first name!");
                          return false;
                        }
                      },
                    },
                    {
                      type: 'input',
                      name: 'last_name',
                      message: "What is your new employee's last name?",
                      validate: lastNameInput => {
                        if (lastNameInput) {
                          return true;
                        } else {
                          console.log("Must enter employee's last name!");
                          return false;
                        }
                      },
                    },
                    {
                      type: 'list',
                      name: 'role_id',
                      message: 'Please select a role for this employee',
                      choices: employeeData[0],
                    },
                    {
                      type: 'list',
                      name: 'manager_id',
                      message: "Who is this employee's manager",
                      choices: [...new Set(employeeData[1].filter(any => any))],
                    },
                  ];

                  return inquirer.prompt(questions);
                })
                .then(async employeeObject => {
                  const response = await fetch(
                    'http://localhost:3001/api/role/' + employeeObject.role_id
                  );

                  if (!response.ok) {
                    return console.log('Error: ' + response.statusText);
                  } else {
                    const data = await response.json();

                    const roleId = data.data[0].id;

                    employeeObject.role_id = roleId;
                  }

                  const managerFirstName =
                    employeeObject.manager_id.split(' ')[0];
                  const managerLastName =
                    employeeObject.manager_id.split(' ')[1];
                  const response2 = await fetch(
                    'http://localhost:3001/api/employee/' +
                      managerFirstName +
                      '/' +
                      managerLastName
                  );

                  if (!response2.ok) {
                    return console.log('Error: ' + response2.statusText);
                  } else {
                    const data2 = await response2.json();

                    const managerId = data2.data[0].id;

                    employeeObject.manager_id = managerId;
                  }

                  return employeeObject;
                })
                .then(employeeObject => {
                  fetch('http://localhost:3001/api/employee', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(employeeObject),
                  })
                    .then(response => {
                      if (response.ok) {
                        return response.json();
                      }
                      alert('Error: ' + response.statusText);
                    })
                    .then(postResponse => {
                      console.log(postResponse);
                      console.log('Employee has been added');
                    });
                })
                .then(startApp);
            });
          break;
        case 'Quit':
          process.exit();
      }
    });
}

module.exports = { startApp };
