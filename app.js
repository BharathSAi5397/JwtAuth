const express = require('express');
const mongoose = require('mongoose');
const authRoutes=require("./routes/authRoutes")
const cookieParser=require("cookie-parser")
const {requireAuth, checkUser} = require("./middlewares/authmiddleware");
require('dotenv').config();
const username=process.env.Userinfo;
const password=process.env.Password;
console.log(username)

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());


// view engine
app.set('view engine', 'ejs');

//database connection
mongoose.connect( `mongodb+srv://${username}:${password}@cluster0.3u7uj8b.mongodb.net/receipes?retryWrites=true&w=majority`)
  .then((result) => {app.listen(3000);
    console.log("listening on port 3000")})
  .catch((err) => console.log(err));

// routes
app.get('*',checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/reciepe',requireAuth, (req, res) => res.render('reciepe'));
app.use(authRoutes)
