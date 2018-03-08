const db = require("../models");


module.exports = (app) => {

    // Retrieve results from mongo
    app.get("/api/articles", function(req, res) {
        // Find all notes in the notes collection
        db.Article.find({}, function(error, found) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        else {
            // Otherwise, send json of the notes back to user
            // This will fire off the success function of the ajax request
            res.json(found);
            console.log("found is " + found);
        }
        });
    });

        // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("article")
        .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

        
    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        db.Article.create(req.body)
        .then(function(dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

        // Save an article
    app.post('/articles/save/:id', function(req, res) {
        // Use the article id to find and update its saved boolean
        Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
        // Execute the above query
        .exec(function(err, doc) {
            // Log any errors
            if (err) {
            console.log(err);
            } else {
            // Or send the document to the browser
            res.send(doc);
            }
        });
    });


}