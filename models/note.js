const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
const NoteSchema = new Schema({
  // `title` must be of type String
  headlineId: {
    type: Schema.Types.ObjectId,
    ref: "Headline" 
  },
  date: {
    type: Date,
    default: Date.now
  },
  noteText: String
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;
