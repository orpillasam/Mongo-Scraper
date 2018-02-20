const express = require("express");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const request = require("request");
const mongoose = require("mongoose");
var mongojs = require("mongojs");

const PORT = process.env.PORT || 8081;

// const db = require("./models");

const app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static("public"));

require("./routes/html-routes.js")(app);
require("./routes/articles-routes.js")(app);

const MONGODB_URI =  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Database configuration
var databaseUrl = "espnScraper";
var collections = ["articles"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function(error) {
  console.log("Database Error:", error);
});


request("https://www.espn.com", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("section.contentItem__content--story").each(function(i, element) {

    // Save the text of the element in a "title" variable
    const title = $(element).find("h1").text();

    const summary = $(element).find("p").text();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    const link = $(element).children("a").attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      summary: summary,
      link: link

    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});






// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });