const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/SchoolManagement')
const db = mongoose.connection;

db.once('open',(err)=>{
    if(err){
        console.log(err)
        return false;
    }
    console.log('db has been connected')
})

module.exports = db;