const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article" 
  },
  date: {
    type: Date,
    default: Date.now
  },
  noteText: String
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;
