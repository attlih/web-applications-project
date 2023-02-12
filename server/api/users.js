var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validateToken = require('../auth/validateToken');
const User = require('../models/User');


// register a user
// TODO add better validation?
router.post('/register/',
  // validate user input
  body('email').isEmail(),
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 8 }),
  (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check if user already exists
    const { username, email, password } = req.body;
    User.findOne({ email: email }, async (err, user) => {
      if (err) {
        res.status(500).json({ message: err.message });
      }
      if (user) {
        res.status(403).json({ message: "User already exists" });
      } else {
        // hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hashedPassword) => {
            if (err) {
              res.status(500).json({ message: err.message });
            }
            // create user
            User.create({
              email: email,
              username: username,
              password: hashedPassword,
            }, (err, user) => {
              if (err) {
                res.status(500).json({ message: err.message });
              }
              res.status(201).json(user);
            });
          });
        });
      }
    });
  }
);

// login a user
router.post('/login/',
  (req, res) => {
    // Find user
    const { email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        res.status(500).json({ message: err.message });
      }
      if (!user) {
        res.status(401).json({ message: "User does not exist" });
      }
      // compare password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(500).json({ message: err.message });
        }
        if (isMatch) {
          // create token
          const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
          };
          jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) {
              res.status(500).json({ message: err.message });
            }
            res.json({success: true, token: "Bearer " + token});
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      });
    });
  }
);

module.exports = router;
