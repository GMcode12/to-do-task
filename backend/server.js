// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'task_management',
});

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API endpoints
app.get('/tasks', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: 'Error connecting to the database' });
    } else {
      connection.query('SELECT * FROM tasks', (err, results) => {
        connection.release();
        if (err) {
          res.status(500).json({ error: 'Error retrieving tasks' });
        } else {
          res.json(results);
        }
      });
    }
  });
});

app.post('/tasks', (req, res) => {
  const { description } = req.body;

  if (!description) {
    res.status(400).json({ error: 'Description is required' });
  } else {
    pool.getConnection((err, connection) => {
      if (err) {
        res.status(500).json({ error: 'Error connecting to the database' });
      } else {
        connection.query(
          'INSERT INTO tasks (description) VALUES (?)',
          [description],
          (err) => {
            connection.release();
            if (err) {
              res.status(500).json({ error: 'Error creating task' });
            } else {
              res.json({ message: 'Task created successfully' });
            }
          }
        );
      }
    });
  }
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  if (!description) {
    res.status(400).json({ error: 'Description is required' });
  } else {
    pool.getConnection((err, connection) => {
      if (err) {
        res.status(500).json({ error: 'Error connecting to the database' });
      } else {
        connection.query(
          'UPDATE tasks SET description = ? WHERE id = ?',
          [description, id],
          (err) => {
            connection.release();
            if (err) {
              res.status(500).json({ error: 'Error updating task' });
            } else {
              res.json({ message: 'Task updated successfully' });
            }
          }
        );
      }
    });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: 'Error connecting to the database' });
    } else {
      connection.query(
        'DELETE FROM tasks WHERE id = ?',
        [id],
        (err) => {
          connection.release();
          if (err) {
            res.status(500).json({ error: 'Error deleting task' });
          } else {
            res.json({ message: 'Task deleted successfully' });
          }
        }
      );
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
