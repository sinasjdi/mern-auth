const express =require('express');
const router=express.Router();
const cors=require('cors')
const passport = require('passport');
const {test,registerUser,loginUser,getProfile,
    verifyUser,forgotPass,resetPass, googleCallback
    ,getProfileViaGoogleToken}=require('../controllers/authController')


//middleware

router.use(
    cors({
        credentials: true,
        origin:process.env.FRONT_URL,
    })
)


router.get('/',test)
router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/profile',getProfile)
router.post('/getProfileViaGoogleToken',getProfileViaGoogleToken)
router.post('/verify',verifyUser)
router.post('/forgot-password',forgotPass)
router.post('/reset-password',resetPass)
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/' }),googleCallback);


module.exports=router