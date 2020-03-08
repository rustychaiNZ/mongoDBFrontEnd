const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
// To parse all data that is coming from the user and the data base
const bodyParser = require('body-parser');
// To include cross origin request
const cors = require('cors');
// To hasha and compare passord in an encrypted method
const bcryptjs = require('bcryptjs');
// Used to store the credentials 
// Sets the port to output to
const port = 3000;

// All files from public folder must be included
app.use(express.static('public'));
// Links bootstrap from node_modules
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
// Adds jquery from node_modules
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
// Adds popper.js from node_modules
app.use('/popper', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd')));
// Adds images from assets folder
app.use('/images', express.static(path.join(__dirname, '/assets')));
// Add custom css
app.use('/css', express.static(path.join(__dirname, '/css')));
// Add custom js
app.use('/js', express.static(path.join(__dirname, '/js')));

// Pages that will display based on where the user is on the application
app.get('/' , (req , res) =>{
	res.sendFile(path.join(__dirname + '/index.html'));
});



//keep this always at the bottom so that you can see the errors reported
app.listen(port, () => console.log(`Example app listening on port ${port}!`))