const express = require('express');
const dbconnect = require('./config/database.js');

// create express app
const app = express();

//Connect to DB
dbconnect();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(express.json());

//api for welcome message
app.get('/', (req, res) => {
    res.json({"message": "Welcome to AddressBook application Backend"});
});

// listen for requests
const port = 6000;
module.exports= app.listen(port, () =>
console.log("Server is listening on port "+port));