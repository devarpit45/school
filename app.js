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




app.use(express.urlencoded())
app.use('/api',require("./routes/api/v1/AdminRoutes"))

app.listen(port,(err)=>{
    if(err){
        console.log(err)
        return false;
    }
    console.log('server has been started on :',port)
})