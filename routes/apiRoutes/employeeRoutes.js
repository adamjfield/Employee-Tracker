const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// get all employees
router.get('/employees', (req, res) => {
  const sql = `SELECT e.id, e.first_name, e.last_name,
               roles.title AS title, 
               departments.dept_name AS department, 
               roles.salary AS salary,
               concat(m.first_name, ' ', m.last_name) AS manager
               FROM employees e
               LEFT JOIN employees m ON m.id = e.manager_id
               LEFT JOIN roles ON e.role_id = roles.id
               LEFT JOIN departments ON roles.department_id = departments.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

// get a single employee by id
router.get('/employee/:id', (req, res) => {
  const sql = `SELECT e.id, e.first_name, e.last_name,
               roles.title AS title, 
               departments.dept_name AS department, 
               roles.salary AS salary,
               concat(m.first_name, ' ', m.last_name) AS manager
               FROM employees e
               LEFT JOIN employees m ON m.id = e.manager_id
               LEFT JOIN roles ON e.role_id = roles.id
               LEFT JOIN departments ON roles.department_id = departments.id
               WHERE e.id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row,
    });
  });
});

// get a single employee by name
router.get('/employee/:first_name/:last_name', (req, res) => {
  const sql = `SELECT e.id, e.first_name, e.last_name,
               roles.title AS title, 
               departments.dept_name AS department, 
               roles.salary AS salary,
               concat(m.first_name, ' ', m.last_name) AS manager
               FROM employees e
               LEFT JOIN employees m ON m.id = e.manager_id
               LEFT JOIN roles ON e.role_id = roles.id
               LEFT JOIN departments ON roles.department_id = departments.id
               WHERE e.first_name = ? AND e.last_name = ?`;
  const params = [req.params.first_name, req.params.last_name];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row,
    });
  });
});

// add an employee
router.post('/employee', ({ body }, res) => {
  const errors = inputCheck(
    body,
    'first_name',
    'last_name',
    'role_id',
    'manager_id'
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
  const params = [
    body.first_name,
    body.last_name,
    body.role_id,
    body.manager_id,
  ];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body,
    });
  });
});

// delete an employee
router.delete('/employee/:id', (req, res) => {
  const sql = 'DELETE FROM employees WHERE id = ?';
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    } else if (!result.affectedRows) {
      res.json({
        message: 'No employee found with this id',
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id,
      });
    }
  });
});

// update employee role
router.put('/employee/:id', (req, res) => {
  const errors = inputCheck(re.body, 'role_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
  const params = [req.body.role_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.json(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'No employee found with this id',
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// update employee manager
router.put('/employee/:id', (req, res) => {
  const errors = inputCheck(re.body, 'manager_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
  const params = [req.body.manager_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.json(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'No employee found with this id',
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

module.exports = router;
