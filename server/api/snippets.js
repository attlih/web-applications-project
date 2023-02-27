const express = require("express");
// require the snippet model
const { Snippet, Comment } = require("../models/Post");
const router = express.Router();
const shortid = require("shortid");
const validateToken = require("../auth/validateToken");

// Get all snippets
router.get("/", (req, res) => {
    Snippet.find({}, (err, snippets) => {
        if (err) {
            res.status(500).json({ message: err.message });
        }
        res.json(snippets);
    });
});

// Get snippet by shortid
router.get("/:id",
    (req, res) => {
        Snippet.findOne({ shortid: req.params.id }, (err, snippet) => {
            if (err) {
                res.status(500).json({ message: err.message });
            }
            res.json(snippet);
        });
    }
);

/* RESTRICTED ROUTES */

// add a snippet
router.post("/", validateToken,
    async (req, res) => {
        const snippet = new Snippet({
            title: req.body.title,
            code: req.body.code,
            shortid: shortid.generate(),
            postedby: req.user.id,
            comments: []
        });
        snippet.save((err, snippet) => {
            if (err) {
                res.status(500).json({ message: err.message });
            }
            res.status(201).json(snippet);
        });
    }
);

// Update snippet likes
router.post("/:id", validateToken,
    async (req, res, next) => {
        const snippet = await Snippet.findOne({ shortid: req.params.id });
        if (!snippet) {
            return res.status(404).json({ error: 'Snippet not found.' });
        }
        const index = snippet.likes.indexOf(req.user.id);
        if (index === -1) {
            snippet.likes.push(req.user.id);
        }
        else {
            snippet.likes.splice(index, 1);
        }
        snippet.save((err, snippet) => {
            if (err) {
                res.status(500).json({ message: err.message });
            }
            res.status(201).json(snippet);
        });
    },
    
);

module.exports = router;
