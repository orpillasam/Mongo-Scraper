
const express = require("express");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const request = require("request");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const axios = require("axios");

const PORT = process.env.PORT || 8082;

// const db = require("./models");

const app = express();

const db = require("./models");

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static("public"));

require("./routes/html-routes.js")(app);
require("./routes/articles-routes.js")(app);

const MONGODB_URI =  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// // Database configuration
// var databaseUrl = "espnScraper";
// var collections = ["articles"];

// // Hook mongojs config to db variable
// var db = mongojs(databaseUrl, collections);

// // Log any mongojs errors to console
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });



// A GET route for scraping the echojs website
app.get("/api/fetch", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.espn.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("section.contentItem__content--story").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .find("h1")
          .text();
        result.summary = $(this)
          .find("p")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            // console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });



  