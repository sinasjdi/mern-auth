const express =require('express');
const router=express.Router();
const cors=require('cors')
const {test,registerUser,loginUser,getProfile,verifyUser,forgotPass,resetPass}=require('../controllers/authController')

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
router.post('/verify',verifyUser)
router.post('/forgot-password',forgotPass)
router.post('/reset-password',resetPass)

module.exports=router