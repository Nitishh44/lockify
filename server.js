require('dotenv').config(); 
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
// Required libraries import ki ja rahi hain


const connectDB = require('./server/database/connection');
// MongoDB connection function import


const app = express(); // Express application initialize


// Environment variables load kiye ja rahe hain

const PORT = process.env.PORT || 8080 // Server ka port set kiya gaya hai



app.use(morgan('tiny')); // HTTP requests ko log karne ke liye
app.use(express.static("assets"));


// mongodb connection
connectDB();

app.use(
  session({
    secret: 'lockify_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 30, // half hour
    },
  })
);
// Session management ke liye express-session aur connect-mogo ka use kiya ja rha 
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
})


app.use(bodyparser.urlencoded({extended:true}));
// Form data ko read karne ke liye body-parser


// set view enginer
app.set("view engine", "ejs")

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
// Static files (CSS, JS, Images) serve ki ja rahi hain


// load routers
app.use('/', require('./server/routes/router'))
app.use('/', require('./server/routes/auth'));
// Application routes load kiye ja rhe hai

app.listen(PORT, () => {console.log(`Server is running http://localhost:${PORT}`)});
// Server start kiya gaya
