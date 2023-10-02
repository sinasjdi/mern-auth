const express=require('express')
const dotenv=require('dotenv').config()
const cors =require('cors')
const {mongoose}=require('mongoose')
const cookieParser=require('cookie-parser')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const session = require('express-session');
const passport = require('passport');



mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('database connected!'))
.catch((err)=> console.log('database not connected',err))


const app=express();
//middleware

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // If you are using cookies or authentication
  }));

app.use(express.json())

app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

app.use(session({
  secret: 'secret', // Change this to a secure secret
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/',require('./routes/authRoutes.js'))




const port=8000;
app.listen(port,()=>console.log(`Server is running on port ${port}`))
