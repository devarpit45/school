const express = require('express')
const routes = express.Router();

const Adminclt = require('../../../../controllers/api/v1/AdminController')

routes.post('/AdminRegister',Adminclt.AdminRegister)

routes.post('/AdminLogin',Adminclt.AdminLogin)

module.exports = routes;