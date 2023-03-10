// Require modules
const express = require('express')
const { Snippet, Comment } = require('../models/Post')
const router = express.Router()
const validateToken = require('../auth/validateToken')
const validateAdmin = require('../auth/validateAdmin')

// get all comments
router.get('/',
  (req, res) => {
    Comment.find({}, (err, comments) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      return res.json(comments)
    })
  }
)

// get all comments for a snippet
router.get('/:id',
  (req, res) => {
    Snippet.findOne({ shortid: req.params.id })
      .populate('comments')
      .exec((err, snippet) => {
        if (err) {
          return res.status(500).json({ error: err.message })
        }
        return res.json(snippet.comments)
      })
  }
)

/* RESTRICTED ROUTES */

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
      await comment.save()
      // save comment id to snippet
      await Snippet.findOneAndUpdate({ shortid: req.body.shortid },
        { $push: { comments: comment._id } },
        { new: true }
      )
      return res.status(201).json(comment)
    } catch (err) {
      return res.status(500).json({ error: err.message })
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
      // check if user has already liked comment
      const index = comment.likes.indexOf(req.user.id)
      if (index === -1) {
        comment.likes.push(req.user.id)
      } else {
        comment.likes.splice(index, 1)
      }
      await comment.save()
      return res.json(comment)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }
)

// edit a comment
router.post('/edit/:id', validateToken,
  (req, res, next) => {
    // update comment and editedon
    Comment.findByIdAndUpdate(req.params.id,
      { comment: req.body.comment, editedon: Date.now() },
      { new: true },
      (err, comment) => {
        if (err) {
          return res.status(500).json({ error: err.message })
        }
        return res.json(comment)
      })
  }
)

/* ADMIN ROUTES */

// delete a comment
router.post('/delete/:id', validateToken, validateAdmin,
  (req, res, next) => {
    // delete comment
    Comment.findByIdAndDelete(req.params.id, (err, comment) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      Snippet.findByIdAndUpdate(req.body.snippet,
        { $pull: { comments: req.params.id } },
        { new: true },
        (err, snippet) => {
          if (err) {
            return res.status(500).json({ error: err.message })
          }
        })
      return res.json(comment)
    })
  }
)

module.exports = router
