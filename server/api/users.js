const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// register a user
// TODO add better validation?
// TODO add good password requirements
router.post('/register/',
  // validate user input
  body('email').isEmail(),
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // check if user already exists
    const { username, email, password } = req.body
    User.findOne({ email }, async (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message })
      }
      if (user) {
        res.status(403).json({ error: 'User already exists' })
      } else {
        // hash password
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            res.status(500).json({ error: err.message })
          }
          bcrypt.hash(password, salt, (err, hashedPassword) => {
            if (err) {
              res.status(500).json({ error: err.message })
            }
            // create admin
            if (username === 'admin') {
              User.create({
                email,
                username,
                password: hashedPassword,
                admin: true
              }, (err, user) => {
                if (err) {
                  res.status(500).json({ error: err.message })
                }
                res.status(201).json(user)
              })
            } else {
              // create user
              User.create({
                email,
                username,
                password: hashedPassword
              }, (err, user) => {
                if (err) {
                  res.status(500).json({ error: err.message })
                }
                res.status(201).json(user)
              })
            }
          })
        })
      }
    })
  }
)

// login a user
router.post('/login/',
  (req, res) => {
    // Find user
    const { user, password } = req.body
    if (!user || !password) {
      res.status(400).json({ error: 'Please enter all fields' })
    } else {
    // handle login with username or email
      User.findOne({ $or: [{ username: user }, { email: user }] }, (err, user) => {
        if (err) {
          res.status(500).json({ error: err.message })
        }
        if (!user) {
          res.status(401).json({ error: 'User does not exist' })
        }
        // compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            res.status(500).json({ error: err.message })
          }
          if (isMatch) {
          // create token
            const payload = {
              id: user._id,
              username: user.username,
              email: user.email
            }
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
              if (err) {
                res.status(500).json({ error: err.message })
              }
              res.json({ success: true, token })
            })
          } else {
            res.status(401).json({ error: 'Invalid credentials' })
          }
        })
      })
    }
  }
)

module.exports = router
