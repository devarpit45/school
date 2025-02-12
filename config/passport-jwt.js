const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy
const extractJwt = require('passport-jwt').ExtractJwt

const opts = {
    jwtFromRequest : extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey :'shh'
}

const Admin = require('../models/Adminmodel')

passport.use(new jwtStrategy (opts , async function(payload,done){
        let Admindata = await Admin.findOne({email:payload.Admindata.email})
        if(Admindata){
                return done(null,Admindata)
        }
        else{
            return done(null,false)
        }
}))

passport.serializeUser((user,done)=>{
    return done(null,user.id)
      
})

passport.deserializeUser( async (id,done)=>{
    let Admindata = await Admin.findById(id)
    if(Admindata){
        return done(null,Admindata)
    }
    else{
        return done(null,false)
    }
    
})

module.exports = passport