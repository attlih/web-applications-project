const express = require('express')
// require the snippet model
const { Snippet, Comment } = require('../models/Post')
const router = express.Router()
// const shortid = require('shortid')
const validateToken = require('../auth/validateToken')
const validateAdmin = require('../auth/validateAdmin')

// get all comments for a snippet
router.get('/:id',
  (req, res) => {
    Snippet.findOne({ shortid: req.params.id })
      .populate('comments')
      .exec((err, snippet) => {
        if (err) {
          res.status(500).json({ error: err.message })
        }
        res.json(snippet.comments)
      })
  }
)

// get all comments
router.get('/',
  (req, res) => {
    Comment.find({}, (err, comments) => {
      if (err) {
        res.status(500).json({ error: err.message })
      }
      res.json(comments)
    })
  }
)

// RESTRICTED ROUTES

// add a comment
router.post('/', validateToken,
  async (req, res, next) => {
    console.log('adding comment')
    // save comment
    try {
      // create comment
      const comment = new Comment({
        comment: req.body.comment,
        postedby: req.user.username
      })
      // save comment
      await comment.save()
      // save comment id to snippet
      await Snippet.findOneAndUpdate({ shortid: req.body.shortid }, { $push: { comments: comment._id } }, { new: true })
      res.status(201).json(comment)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

// like a comment
router.post('/like/:id', validateToken,
  async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.id)
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found.' })
      }
      const index = comment.likes.indexOf(req.user.id)
      if (index === -1) {
        comment.likes.push(req.user.id)
      } else {
        comment.likes.splice(index, 1)
      }
      await comment.save()
      res.json(comment)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

// edit a comment
router.post('/edit/:id', validateToken,
  (req, res, next) => {
    // update comment and editedon
    Comment.findByIdAndUpdate(req.params.id, { comment: req.body.comment, editedon: Date.now() }, { new: true }, (err, comment) => {
      if (err) {
        res.status(500).json({ error: err.message })
      }
      res.json(comment)
    })
  }
)

// delete a comment
router.post('/delete/:id', validateToken, validateAdmin,
  (req, res, next) => {
    // delete comment
    Comment.findByIdAndDelete(req.params.id, (err, comment) => {
      if (err) {
        res.status(500).json({ error: err.message })
      }
      Snippet.findByIdAndUpdate(req.body.snippet, { $pull: { comments: req.params.id } }, { new: true }, (err, snippet) => {
        if (err) {
          res.status(500).json({ error: err.message })
        }
      })
      res.json(comment)
    })
  }
)

module.exports = router
