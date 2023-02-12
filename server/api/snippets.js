const express = require("express");
const Snippet = require("../models/Snippet");
const router = express.Router();
const shortid = require("shortid");

// Get all snippets
router.get("/", async (req, res) => {
    try {
        const snippets = await Snippet.find();
        res.json(snippets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get snippet by shortid
router.get("/:id", (req, res) => {
    Snippet.findOne({shortid: req.params.shortid}, (err, snippet) => {
        if (err) {
            res.status(500).json({ message: err.message });
        }
        res.json(snippet);
    });
});


// add a snippet
router.post("/", async (req, res) => {
    const snippet = new Snippet({
        title: req.body.title,
        code: req.body.code,
        shortid: shortid.generate(),
    });
    snippet.save((err, snippet) => {
        if (err) {
            res.status(500).json({ message: err.message });
        }
        res.status(201).json(snippet);
    });
});

module.exports = router;


