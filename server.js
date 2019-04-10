//Import Modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

//Routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// Initialize Express App
const app = express();

//Middleware
// @desc:   Body Parser Middleware
bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// @desc:   Passport Middleware
app.use(passport.initialize());

// @desc:    Passport Config
require('./config/passport')(passport);


// DB Config
const db = require('./config/keys').mongoURI;

// MLabs Connection (MongoDB)
mongoose
    .connect(db)
    .then(() => console.log("MLab MongoDB Connected!"))
    .catch(err => console.log(`Error in connection ${err}`));


// Default Route Test
// app.get('/', (req, res) => {
//     res.send("Hello!!!");
// });

//Using Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

//Production
if(process.env.NODE_ENV === 'production') {
	app.use('*', (req, res)=> {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index1.html'));
	});
}
//Define port
const port = process.env.PORT || 6000;

//Start Server
app.listen(port, () => console.log(`Server running on ${port}`));