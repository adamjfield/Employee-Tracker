const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// get all roles with departments attached
router.get('/roles', (req, res) => {
  const sql = `SELECT roles.*, departments.dept_name AS dept_name FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;
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

// get a single role by id
router.get('/role/:id', (req, res) => {
  const sql = `SELECT roles.*, departments.dept_name AS dept_name FROM roles LEFT JOIN departments ON roles.department_id = departments.id WHERE roles.id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row,
    });
  });
});

// delete single role by id
router.delete('/role/:id', (req, res) => {
  const sql = `DELETE FROM roles WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Role not found',
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

// add a new role
router.post('/role', ({ body }, res) => {
  const errors = inputCheck(body, 'title', 'salary', 'department_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
  const params = [body.title, body.salary, body.department_id];
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

module.exports = router;
