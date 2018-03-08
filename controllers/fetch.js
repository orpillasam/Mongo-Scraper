const db = require("../models");
const scrape = require("../scripts/scrape");

module.exports = {
  scrapeHeadlines: function(req, res) {
    return scrape()
      .then(function(articles) {
        return db.Article.create(articles);
      })
      .then(function(dbArticle) {
        if (dbArticle.length === 0) {
          res.json({
            message: "No new articles today."
          });
        }
        else {
          res.json({
            message: "Added " + dArticle.length + " new articles."
          });
        }
      })
      .catch(function(err) {
        res.json({
          message: "Scrape completed!"
        });
      });
  }
};
