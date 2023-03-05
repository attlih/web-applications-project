const express = require('express')
// require the snippet model
const { Snippet, Comment } = require('../models/Post')
const router = express.Router()
const shortid = require('shortid')
const validateToken = require('../auth/validateToken')
const validateAdmin = require('../auth/validateAdmin')

// Get all snippets
router.get('/', (req, res) => {
  Snippet.find({}, (err, snippets) => {
    if (err) {
      res.status(500).json({ error: err.message })
    }
    res.json(snippets)
  })
})

// Get snippet by shortid
router.get('/:id',
  (req, res) => {
    Snippet.findOne({ shortid: req.params.id }, (err, snippet) => {
      if (err) {
        res.status(500).json({ error: err.message })
      }
      res.json(snippet)
    })
  }
)

// get snippets by search
router.post('/search/', (req, res) => {
  // find matches from title and code
  Snippet.find({ $or: [{ title: { $regex: req.body.search, $options: 'i' } }, { code: { $regex: req.body.search, $options: 'i' } }] }, (err, snippets) => {
    if (err) {
      res.status(500).json({ error: err.message })
    }
    res.json(snippets)
  })
})

/* RESTRICTED ROUTES */

// add a snippet
router.post('/add', validateToken,
  async (req, res) => {
    const snippet = new Snippet({
      title: req.body.title,
      code: req.body.code,
      shortid: shortid.generate(),
      postedby: req.user.id,
      comments: []
    })
    snippet.save((err, snippet) => {
      if (err) {
        res.status(500).json({ error: err.message })
      }
      res.status(201).json(snippet)
    })
  }
)

// Update snippet likes
router.post('/like/:id', validateToken,
  async (req, res, next) => {
    try {
      const snippet = await Snippet.findOne({ shortid: req.params.id })
      if (!snippet) {
        return res.status(404).json({ error: 'Snippet not found.' })
      }
      const index = snippet.likes.indexOf(req.user.id)
      if (index === -1) {
        snippet.likes.push(req.user.id)
      } else {
        snippet.likes.splice(index, 1)
      }
      snippet.save((err, snippet) => {
        if (err) {
          res.status(500).json({ error: err.message })
        }
        res.status(201).json(snippet)
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

// update a snippet
router.post('/update/:id', validateToken,
  async (req, res, next) => {
    // update snippet, title, code and editedon
    try {
      const snippet = await Snippet.findOneAndUpdate({ shortid: req.params.id }, {
        title: req.body.title,
        code: req.body.code,
        editedon: Date.now()
      }, { new: true })
      if (!snippet) {
        return res.status(404).json({ error: 'Snippet not found.' })
      }
      snippet.save((err, snippet) => {
        if (err) {
          res.status(500).json({ error: err.message })
        }
        res.status(201).json(snippet)
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

)

/* RESTRICTED ADMIN ROUTES */

// delete a snippet
router.post('/delete/:id', validateToken, validateAdmin,
  (req, res, next) => {
    Snippet.findOneAndDelete({ shortid: req.params.id }, (err, snippet) => {
      if (err) {
        res.status(500).json({ error: err.message })
      }
      // Delete all comments associated with snippet
      Comment.deleteMany({ _id: { $in: snippet.comments } }, (err) => {
        if (err) {
          res.status(500).json({ error: err.message })
        }
      })
      res.status(201).json(snippet)
    })
  }
)

module.exports = router
