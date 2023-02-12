const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema({
    title: String,
    code: String,
    shortid: String,
});

module.exports = mongoose.model("Snippet", snippetSchema);