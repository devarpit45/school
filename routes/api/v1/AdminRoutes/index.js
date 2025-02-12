const express = require('express')
const routes = express.Router();

const Adminclt = require('../../../../controllers/api/v1/AdminController')
const passport = require('passport')

routes.post('/AdminRegister',Adminclt.AdminRegister)

routes.post('/AdminLogin',Adminclt.AdminLogin)

routes.get('/Adminprofile/:id',passport.authenticate('jwt',{failureRedirect:'/api/unauth'}),Adminclt.Adminprofile)

routes.get('/unauth',(req,res)=>{
    try{
        res.status(200).json({msg:"you are not authenticated"})
    }
    catch(err){
        res.status(400).json({msg:"something wrong",error:err})
    }
})

routes.put('/editprofile/:id',passport.authenticate('jwt',{failureRedirect:'/api/unauth'}),Adminclt.editprofile)

routes.get('/AdminLogout',(req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                res.status(200).json({msg:"something wrong"})
            }
            else{
                res.status(200).json({msg:"you are logged out"})
            }
        })
    }   
    catch(err){
        res.status(400).json({msg:"something wrong",error:err})
    }
})


routes.post('/changePassword',passport.authenticate('jwt',{failureRedirect:'/api/unauth'}),Adminclt.changePassword)

module.exports = routes;