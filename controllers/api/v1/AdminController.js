const Admin = require('../../../models/Adminmodel')
const bycrypt = require("bcrypt")
const jwt = require('jsonwebtoken')


module.exports.AdminRegister = async(req,res)=>{
    try{
        console.log(req.body)
        let checkemail = await Admin.findOne({email:req.body.email})
        if(!checkemail){
            if(req.body.password == req.body.confirmpassword){
                req.body.password =  await bycrypt.hash(req.body.password,10)
                let AdminRegister = await Admin.create(req.body);
                if(AdminRegister){
                    res.status(200).json({msg:"Registration Sucessfully done",record:AdminRegister})
                }
                else{
                    return res.status(200).json({message:"Registration failed"})
                }
            }
            else{
                return res.status(200).json({message:"Password and Confirm Password does not match"})
            }
        }
        else{
            res.status(200).json({msg:"email Already Exist !!"})
        }
    }
    catch(err){
        res.status(400).json({msg:"something wrong",error:err})
    }
}

module.exports.AdminLogin = async(req,res)=>{
    try{
        console.log(req.body)
        let checkemail = await Admin.findOne({email:req.body.email})

        if(checkemail){
            let checkpass =  await bycrypt.compare(req.body.password,checkemail.password)
            if(checkpass){
               
                let Admintoken = jwt.sign({Admindata : checkemail},"shh")
                res.status(200).json({msg:"login succesfully",data:Admintoken})
            }
            else{
                res.status(200).json({msg:"Invalid password"})
            }
        }
        else{
            res.status(200).json({msg:"Invalid email"})
        }
    }
    catch(err){
        res.status(400).json({msg:"something wrong",error:err})
    }
}