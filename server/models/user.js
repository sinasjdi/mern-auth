const mongoose=require('mongoose')
const {Schema}=mongoose

const userSchema=new Schema({
name:String,
email:{
    type:String,
    unique:true
},
password:String,
verification: String,
isVerified: {
  type: Boolean,
  default: false, // You can set the default value as per your requirements
},


})

const UserModel= mongoose.model('User',userSchema)

module.exports=UserModel;