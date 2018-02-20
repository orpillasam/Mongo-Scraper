const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
const ArticleSchema = new Schema({
  // `title` must be of type String
  title: {
    type: String,
    required: true
    },
  // `body` must be of type String
  summary: {
    type: String,
    required: true
    },
  link: {
      type: String,
      required: true
      }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Note model
module.exports = Article;
