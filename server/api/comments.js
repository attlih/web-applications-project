const express = require("express");
// require the snippet model
const { Snippet, Comment } = require("../models/Post");
const router = express.Router();
const shortid = require("shortid");
const validateToken = require("../auth/validateToken");

// get all comments for a snippet
router.get("/:id",
    (req, res) => {
        Snippet.findOne({ shortid: req.params.id })
            .populate("comments")
            .exec((err, snippet) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                }
                res.json(snippet.comments);
            });
    }
);

// get all comments 
router.get("/",
    (req, res) => {
        Comment.find({}, (err, comments) => {
            if (err) {
                res.status(500).json({ message: err.message });
            }
            res.json(comments);
        });
    }
);

// add a comment
router.post("/", validateToken,
    async (req, res, next) => {
        // save comment
        try {
            // create comment
            const comment = await Comment.create({
                postedby: req.user.username,
                comment: req.body.comment
            });
            // save comment
            await comment.save();
            // save comment id to snippet
            const snippet = await Snippet.findOneAndUpdate({ shortid: req.body.shortid }, { $push: { comments: comment._id } }, { new: true });
            res.status(201).json(comment);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
)

module.exports = router;