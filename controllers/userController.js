const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { createUserToken } = require('../middleware/auth');
const { requireToken } = require('../middleware/auth');
const bcrypt = require('bcrypt')

//Creates user account info then hashes/salts passowrd
router.post('/signup', async (req, res, next) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10)
    const email = req.body.email
    const name = req.body.name
    const user = await User.create({ email, password, name })
    res.status(201).json(user)
  } catch (error) {
    return next(error)
  }
})

//finds a user in the db from the email provided. If login credentials are correct it generates a token otherwise throws an error("user info incorre") 
router.post('/signin', (req, res, next) => {
   User.findOne({ email: req.body.email })
  //  .then((userInfo) => res.status(201).json(userInfo))
   .then((user) => createUserToken(req, user)) 
   .then((token) => res.json({ token }))
   .catch(next);
})

// get request for user info
router.get('/:id', requireToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id) 
if(user) {
    res.json(user)
} else {
    res.sendStatus(404)
}
} catch(err) {
    next(err)
}
})


module.exports = router