const Admin = require('../../../models/Adminmodel')
const bycrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const Faculty = require('../../../models/Facultymodel')


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

module.exports.Adminprofile = async(req,res)=>{
    try{
        console.log(req.params.id)
        let getdata = await Admin.findById(req.params.id)
        if(getdata){
                res.status(200).json({msg:"profile found",data:req.user._id})
        }
        else{
            res.status(200).json({msg:"No data found"})
        }
    }
    catch(err){
        res.status(400).json({msg:"something wrong",error:err})
    }
}

module.exports.editprofile = async(req,res)=>{
    try{
        let checkdata = await Admin.findById(req.params.id)
        if(checkdata){
            let updatedata = await Admin.findByIdAndUpdate(req.params.id,req.body)
            if(updatedata){
                let dataupdated = await Admin.findById(req.params.id)
                res.status(200).json({msg:"profile data updated sucessfully",data:dataupdated})
            }
            else{
                res.status(200).json({msg:"data not updated"})
            }
        }
        else{
            res.status(200).json({msg:"No data found"})
        }
    }   
    catch(err){
        res.status(400).json({msg:"something wrong",error:err})
    }
}

module.exports.changePassword = async(req,res)=>{
    try{
        let Admindata = await Admin.findById(req.user._id)
        console.log(Admindata)
        if(Admindata){
            let checkpassword = await bycrypt.compare(req.body.oldpassword,Admindata.password)
            console.log(checkpassword)
            if(checkpassword){
                if(req.body.oldpassword != req.body.newpass){
                    if(req.body.newpass == req.body.confirmpass){
                        req.body.password = await bycrypt.hash(req.body.newpass,10)
                        let updatedata = await Admin.findByIdAndUpdate(req.user._id,req.body)   
                        if(updatedata){
                            let updatedpass = await Admin.findById(req.user._id)
                            res.status(200).json({msg:"password updated sucessfully",data:updatedpass})
                             }
                        else{
                            res.status(200).json({msg:"password not updated"})
                        }
                    }
                    else{
                        res.status(200).json({msg:"new password and confirm password not match"})
                    }
                }
                else{
                    res.status(200).json({msg:"old and new password are same"})
                }
            }
            else{
                res.status(200).json({msg:"old password is incorrect"})
            }
            

        }
           
        else{
            res.status(200).json({msg:"No data found"})
        }
    }
     catch(err){
        res.status(400).json({msg:"something wrong",error:err})
    }
}

module.exports.sendMail = async(req,res)=>{
    try{
        let checkAdmin = await Admin.findOne({email:req.body.email})
        
        if(checkAdmin){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "arpitshekhda45@gmail.com",
                  pass: "ogwyyzwpxgpnqooj",
                },
                tls:{
                    rejectUnauthorized:false
                }
              });

              let otp = Math.round(Math.random()*10000);
              console.log(otp)

              const info = await transporter.sendMail({
                from:'arpitshekhda45@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: 'otp', // Subject line
                html:`<h2>${otp}</h2>` , // html body
              });
          
              
        }
        else{
            res.status(200).json({msg:"email not found"})
        }
    }
    catch(err){
        res.status(400).json({msg:"something wrong",error:err})
    }
}

module.exports.updateforgotpass = async(req,res)=>{
    try{
        let data = await Admin.findById(req.user.id)
        if(req.body.newpass == req.body.confirmpass){
            let password = await bycrypt.hash(req.body.newpass,10)
            if(password){
                await Admin.findByIdAndUpdate(req.user.id,{password})
                return res.status(400).json({ mes: 'Password Change success' })
            }
            else {
                return res.status(400).json({ msg: 'Password not changed' })
            }
        }
        else{
            res.status(200).json({msg:"password and confirm password not match"})
        }
    }
    catch(err){
        res.status(400).json({msg:"something wrong",error:err})
    }
}

module.exports.AddFaculty = async(req,res)=>{
    try{
        let existemail = await Faculty.findOne({email:req.body.email})
        console.log(existemail)
         if(!existemail){
            var gpass = passwordGeneraator();
            var link = "http://localhost:8008/api/"

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "arpitshekhda45@gmail.com",
                  pass: "ogwyyzwpxgpnqooj",
                },
                tls:{
                    rejectUnauthorized:false
                }
              });

              let otp = Math.round(Math.random()*10000);
              console.log(otp)

              const info = await transporter.sendMail({
                from:'arpitshekhda45@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: 'Registration', // Subject line
                html:`<h2>email :${req.body.email}</h2> <h2>password : ${gpass}</h2> <p>link: ${link}</p>` , // html body
              });

              let AddFaculty = await Faculty.create(req.body)
              if(AddFaculty){
                res.status(200).json({msg:"data added"})
              }
              else{
                res.status(200).json({msg:"data not added"})
              }

        }
        else{
            res.status(400).json({msg:"email not found"})
        }
    }
    catch(err){
        res.status(400).json({msg:"something wrong",error:err})
    }
}

const passwordGeneraator = () => {
    let passwordString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&"
    let password = ''
    for (i = 0; i <= 5; i++) {
        password += passwordString[Math.floor(Math.random() * passwordString.length)]
    }
    return password
}