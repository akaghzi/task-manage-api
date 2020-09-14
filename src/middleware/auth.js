const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        // console.log(token)
        const decoded = await jwt.decode(token, process.env.JWT_KEY)
        // console.log(decoded)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        // console.log(user)
        if(!user){
            throw new Error()
        }
        req.token = token
        req.current_user = user
        next()
    }catch (e) {
        // console.log(e)
        res.status(401).send({error: 'Unauthorized'})
    }
}

module.exports = auth