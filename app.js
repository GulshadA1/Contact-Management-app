const express = require('express');
const mysql = require('mysql2/promise'); // We're using the 'mysql2' library
const connection = require('./dbConnection');
const bodyParser = require('body-parser');

const app = express();
const port = 7000; // Set your desired port

connection.connect((e) => {
    if (e) throw e;
    else console.log('connected to the database successfully');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/displayContact.html');
});

app.get('/getContactData', (req, res) => {
    // Define an SQL query to select data from the 'contact_management' table
  const sql = 'SELECT * FROM contact_management';
  
    // Execute the query
    connection.query(sql, (err, results) => {
        if (err) {
          console.error('Error fetching contact data:', err);
          res.status(500).json({ error: 'Error fetching contact data' });
        } else {
          res.json(results);
        }
    });
});
  
app.get('/getContactDataUsingId/:id', (req, res) => {
  const contactId = req.params.id;
  const sql = 'SELECT * FROM contact_management WHERE id = ?';
  connection.query(sql, [contactId], (err, results) => {
    if (err) {
      console.error('Error fetching contact data:', err);
      res.status(500).json({ error: 'Error fetching contact data' });
    } else {
      res.json(results);
    }
  });
});



app.post('/insertContact', (req, res) => {
    // Extract the data from the request body
    const {
      first_name,
      last_name,
      email,
      mobile_phone,
      work_phone,
      home_phone,
      address,
      city,
      state,
      zip_code
    } = req.body;
  

    const sql = `INSERT INTO contact_management (first_name, last_name, email, mobile_phone, work_phone, home_phone, address, city, state, zip_code)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [first_name, last_name, email, mobile_phone, work_phone, home_phone, address, city, state, zip_code], (err, result) => {
      if (err) {
        // console.error('Error inserting data: ' + err);
        res.status(500).send('Error inserting data');
      } else {
        // console.log('Data inserted successfully');
        res.send('Data received and inserted successfully.');
      }
    });
  });

app.delete('/deleteContact/:id', (req, res) => {
  const contactId = req.params.id;
  const sql = 'DELETE FROM contact_management WHERE id = ?'; 
  connection.query(sql, [contactId], (err, result) => {
      if (err) {
          console.error('Error deleting contact:', err);
          res.status(500).send('Error deleting contact.');
      } else {
          if (result.affectedRows > 0) {
            res.sendStatus(204);
          } else {
              res.status(404).send('Contact not found.');
          }
      }
  });
});
app.post('/updateContact', (req, res) => {
    const contactId =  req.body.id;
      const {
        first_name,
        last_name,
        email,
        mobile_phone,
        work_phone,
        home_phone,
        address,
        city,
        state,
        zip_code
    } = req.body;
  
    const sql = 'UPDATE contact_management SET first_name = ?, last_name = ?, email = ?, mobile_phone = ?, ' +
      'work_phone = ?, home_phone = ?, address = ?, city = ?, state = ?, zip_code = ? WHERE id = ?';
    
    const parameter = [first_name, last_name, email, mobile_phone, work_phone, home_phone, address, city, state, zip_code,contactId];
    connection.query(sql, parameter, (err, result) => {
          if (err) {
            // console.error('Error inserting data: ' + err);
            res.status(500).send('Error updating data');
          } else {
            // console.log('Data inserted successfully');
            res.send('Data updated successfully.');
          }
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
  