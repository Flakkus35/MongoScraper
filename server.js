var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

// Grab our mongoose models
var db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
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
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Routes
app.get("/", function(req, res) {
	res.render("empty");
});

// Scrape articles from site and stores in database
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
					console.log("scraped");
				})
				.catch(function(err) {
					return res.json(err);
				});
		});
		res.redirect("/display");
	});
});

// Displays articles from database
app.get("/display", function(req, res) {
	db.Article
		.find({})
		.then(function(articleObj) {
			res.render("articles", {articles: articleObj});
		});
});

// Saves articles
app.post("/save/:id", function(req, res) {
	var savedId = req.params.id;
	db.Article
		.findOne({ _id: savedId })
		.update({ saved: true })
		.then(function(savedArticles) {
			res.json(savedArticles);
		})
		.catch(function(err) {
			return res.json(err);
		});
});

// Displays saved articles
app.get("/saved", function(req,res) {
	db.Article
		.find({ saved: true })
		.then(function(savedArticles) {
			res.render("saved", {saved: savedArticles});
		})
		.catch(function(err) {
			return res.json(err);
		});
});

// Deletes saved articles
app.post("/delete/:id", function(req, res) {
	var savedId = req.params.id;
	db.Article
		.find({ _id: savedId })
		.update({ saved: false })
		.then(function(delArticle) {
			res.json(delArticle);
		})
		.catch(function(err) {
			return res.json(err);
		});
});

// Displays notes on article
app.get("/notes/:id", function(req, res) {
	var savedId = req.params.id;
	db.Article
		.findOne({ _id: savedId })
		.populate("note")
		.then(function(dbArticle) {
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.json(err);
		});
});

// Adds a Note to article
app.post("/addnote/:id", function(req, res) {
	var savedId = req.params.id;
	console.log(savedId);
	console.log(req.body);
	db.Note.create(req.body)
	.then(function(dbNote) {
		console.log(dbNote._id);
		return db.Article.findOneAndUpdate({ _id: savedId }, { $set: { note: dbNote._id }}, { new: true });
	})
	.catch(function(err) {
		res.json(err);
	});
});

// Deletes note from article
app.post("/deletenote/:id", function(req, res) {
	var savedId = req.params.id;
	db.Article
		.findOne({ _id: savedId })
		.remove({ note: req.body })
		.then(function(dbArticle) {
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.json(err);
		});
});

app.listen(PORT, function() {
	console.log("Listening on port " + PORT);
})