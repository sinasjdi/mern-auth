const express=require('express')
const dotenv=require('dotenv').config()
const cors =require('cors')
const {mongoose}=require('mongoose')
const cookieParser=require('cookie-parser')

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


app.use('/',require('./routes/authRoutes.js'))


const port=8000;
app.listen(port,()=>console.log(`Server is running on port ${port}`))
