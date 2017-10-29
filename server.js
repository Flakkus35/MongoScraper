var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

// Grab our mongoose models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Express
var app = express();

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

// Mongoose
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoScraperDB", {
  useMongoClient: true
});

// Routes
app.get("/", function(req, res) {
	res.render("empty");
});

// Scrape articles from site
app.get("/scrape", function(req, res) {
	axios.get("https://www.nytimes.com/section/world?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=World&WT.nav=page")
	.then(function(response) {
		var $ = cheerio.load(response.data);

		$(".story-meta").each(function(i, element) {
			var result = {};
			var temp = '';

			// Remove \n and white space from headline
			temp = $(this).children("h2").text();
			temp = temp.replace('\n', '');
			temp = temp.trim();
			/*console.log(temp);*/

			// Store article info into empty result object
			result.headline = temp;
			result.summary = $(this).children(".summary").text();
			result.link = $(this).parent("a").attr("href");

			/*console.log(result);*/

			db.Article
				.create(result)
				.then(function(dbArticle) {
					/*res.json(dbArticle);*/
					console.log(dbArticle);
				})
				.catch(function(err) {
					return res.json(err);
				});
		});
		/*res.json("complete");*/
		res.redirect("/display");
	});
	/*.then(function() {
		db.Article
			.find({})
			.then(function(articleObj) {
				res.render("articles", articleObj);
				res.json(articleObj);
				res.redirect("/display");
			})
			.catch(function(err) {
				return res.json(err);
			});
	});*/
});

app.get("/display", function(req, res) {
	db.Article
		.find({})
		.then(function(articleObj) {
			/*res.json(articleObj);*/
			res.render("articles", {articles: articleObj});
		});
});

app.listen(PORT, function() {
	console.log("Listening on port " + PORT);
})