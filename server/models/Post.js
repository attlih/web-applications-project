const mongoose = require('mongoose')
const Schema = mongoose.Schema

const snippetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: String,
  shortid: { type: String, required: true, unique: true },
  postedby: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  postedon: {
    type: Date,
    default: Date.now
  },
  editedon: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

const commentSchema = new mongoose.Schema({
  postedby: { type: String, required: true },
  postedon: {
    type: Date,
    default: Date.now
  },
  editedon: { type: Date, default: Date.now },
  comment: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = {
  Snippet: mongoose.model('Snippet', snippetSchema),
  Comment: mongoose.model('Comment', commentSchema)
}
