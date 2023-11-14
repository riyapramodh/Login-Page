// under routes
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); 


const pool = mysql.createPool({
  host: '34.93.46.162',
  user: 'root',
  database: 'login',
});


pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
  console.log('Connected to the MySQL database');

  router.get('/', (req, res) => {
    console.log('Accessing the root URL.');
    res.render('login');
  });

 
  router.post('/login/auth', async (req, res) => {
    const { username, password } = req.body;

   
    const query = 'SELECT username, password FROM users WHERE username = ?';
    connection.query(query, [username], async (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        res.send('An error occurred during submission');
        return;
      }

      if (results.length === 1) {
        const match = await bcrypt.compare(password, results[0].password);
        if (match) {
          res.send('Login successful');
        } else {
          res.send('Invalid password');
        }
      } else {
        res.send('Invalid username');
      }
    });
  });

  
  connection.release();
});

module.exports = router;
