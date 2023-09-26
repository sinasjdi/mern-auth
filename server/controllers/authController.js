const User = require('../models/user')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {
    comparePassword,
    hashPassword
} = require("../helpers/auth")
const jwt=require('jsonwebtoken');
const router = require('../routes/authRoutes');



const test = (req, res) => {
    res.json('test is working')
}


// Generate a random verification token
function generateVerificationToken() {
    return crypto.randomBytes(20).toString('hex');
  }
  

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.BACK_EMAIL_ADDR,
      pass: process.env.BACK_EMAIL_PASS, // Use the generated App Password or your Gmail password
    },
  });


//Register user Endpoint

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;
        //check if name was entered
        const verificationToken = generateVerificationToken();
        if (!name) {
            return res.json({
                error: 'name is required'
            })
        }

        //check if name was entered

        if (!password || password.length < 6) {
            return res.json({
                error: 'Password is required and should be at least 6 characters.'
            })

        };
        //check email

        const exist = await User.findOne({
            email
        })
        if (exist) {
            return res.json({
                error: 'This email has been registered.'
            })
        }

        //hash password
        const hashedPassword = await hashPassword(password)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified:false,
            verification:verificationToken,

        })

        const mailOptions = {
            from: process.env.BACK_EMAIL_ADDR,
            to: email,
            subject: 'Verify Your Email',
            html: `
              <p>Click the following link to verify your email:</p>
              <a href="${process.env.BACK_URL}/verify?token=${verificationToken}">Verify Email</a>
            `,
          };
        
        await transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });

        return res.json(user)
    } catch (error) {

        console.log(error)
    }
}


// Login Endpoint /// with jwt implementation if passwords match

const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        //check if user exists
        const user = await User.findOne({email});
        if (!user) {
            return res.json({
                error: 'No User found'
            })
        }
if(user.isVerified==false)
{
    return res.json({
        error: 'Please verify your email to login. An email has been sent to the email address you registered with.'
    })
}
        
        const match = await comparePassword(password, user.password)
        if (match) {
            jwt.sign({email:user.email,id:user._id,name:user.name},process.env.JWT_SECRET,{},(err,token)=>{
            if(err) throw err; 
            res.cookie('token',token).json(user)
        })
        }
        if(!match){
            return res.json({ error:'password do not match!'})
        }



    } catch (error) {
        console.log(error)
    }
}




// Endpoint to handle email verification
const verifyUser=async(req,res)=> {
    const token = req.query.token;
  

  try {
    // Find the user by verification token
    const user = await User.findOne({ verification: token });

    if (!user) {
      return res.status(404).json({ message: 'Token not found or expired.' });
    }

    // Mark the user as verified
    user.isVerified= true;
    await user.save();
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).sendFile(__dirname +'/emailVerification.html');
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Email verification failed.' });
  }
    
  };



const getProfile=(req,res)=>{
const {token}=req.cookies
if(token)
{jwt.verify(token,process.env.JWT_SECRET,{},(err,user)=>{
    if (err) throw err;
    res.json(user)
})

}else{res.json(null)}

}






module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    verifyUser,
}