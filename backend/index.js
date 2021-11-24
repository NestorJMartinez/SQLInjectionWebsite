const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const app = express()

// Connects to the SQL database
let db = new sqlite3.Database("./db/ugh.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => { 
      if (err) {
        console.error(err.message)
      }
      else {
         console.log('Connected to file db')
      }
    });


// SQL queries formatted so only the password can have code injected
const sql1 = `SELECT email, password, emails.id, passwords.id FROM emails inner join passwords on emails.email = ? ` +
 'and passwords.password = \'' 
 const sql2 = '\' where emails.id = passwords.id';

// Might use this later
//  app.use((req, res, next) => {
//    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//    res.header('Access-Control-Allow-Credentials', 'true')
//    next();
//  });

// Allows for json bodies to be read easier
app.use(express.json())
app.use(express.urlencoded({
   extended: true
 }));

 // Use this so the frontend can talk with the backend
 app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, " +
      "Content-Type, Accept");
   next();
 });

 // Generic response to the root directory
app.get('/',(req, res) => {
   res.status(200)
   res.send('')
})

/* This is where the user's email and password get checked with the 
   SQL file database. */
app.post('/login', (req, res) => {
   const userLower = req.body.username
   const passLower = req.body.password.toLowerCase()

// Checks to see if the username has any SQL code
   if (userLower.includes('\'') || userLower.includes('#') || userLower.includes('-')) {
      res.status(400)
      res.json({output: 'SERVER_ERROR: SQL detected: ' + req.body.username})
   }

// Checks the password for any SQL code that would modify the tables
   else if (passLower.includes('drop') || passLower.includes('create') || passLower.includes('insert')
      || passLower.includes('or') || passLower.includes('#')) {
      res.status(401)
      res.json({output: 'SERVER_ERROR: SQL keyword detected: ' + req.body.password.toLowerCase()})
   }
   else {
      const sqlStatement = sql1 + req.body.password + sql2
      db.get(sqlStatement, 
         [req.body.username], (err, row) => {
         
/* If the SQL query returns an error, a 400 code is sent along with the
   error message. If the username and password are correct, then a 200 code
   is sent, and if the username or password is wrong then a 401 code is
   sent. */
         if (err) {
            res.status(400)
            res.json({output: err.message});
         }
         else {
            if (row) {
               res.status(200)
               res.json({output: ''})
            }
            else {
               res.status(401)
               res.json({output: 'Incorrect Password'})
            }
      }});
   }
})


app.listen(4000)