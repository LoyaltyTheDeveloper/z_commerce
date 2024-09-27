const jwt = require("jsonwebtoken");
const User = require('../Model/userModel.js');
require("dotenv").config();

module.exports.requireAuth = (req, res, next) => {
    const { authorization } = req.headers 


 if ( !authorization ) {
    return res.status(401).json({error: 'Auth token required'})
 }

 const token = authorization.split(' ')[1]

 try{
   const decoded = jwt.verify(token, process.env.TOKEN_KEY)
    req.savedUser = decoded;
    next();
 } catch(error) {
   console.log(error)
   res.status(401).json({error: 'Request not authorized'})
 }
}