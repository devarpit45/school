const express = require('express')
const port = 8008;
const mongoose =require('mongoose')
const app = express()

// const db = require("./config/mongoose")
const db = mongoose.connect("mongodb+srv://arpitshekhda45:gPbdGSGTvYJHpNev@cluster0.nwtwk.mongodb.net/SchoolManagement")
if(db){
    console.log('db connected')
}
else{
    console.log('db not connected')
}

const jwtStrategy = require('./config/passport-jwt')
const session = require('express-session')
const passport = require('passport')

app.use(express.urlencoded())

app.use(session({
    name:"api",
    secret:'school',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:(1000*60*60)
    }
}))

app.use(passport.initialize())
app.use(passport.session())


app.use('/api',require("./routes/api/v1/AdminRoutes"))

app.listen(port,(err)=>{
    if(err){
        console.log(err)
        return false;
    }
    console.log('server has been started on :',port)
})