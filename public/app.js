$(document).ready(function() {
	$("#scrape_button").on("click", function(event) {
		event.preventDefault();
		document.location.href="/scrape";
	});

	/*$(document).on("click", ".article_headline", function() {

	})*/

	$(document).on("click", ".save_article", function(event) {
		event.preventDefault();
		var thisId = $(this).attr("data-id");
		$.post("/save/" + thisId, {})
		.then(function(data) {
			console.log(data);
		})
		.catch(function(err) {
			return console.log(err);
		});
	});

	$(document).on("click", "#saved_articles_button", function(event) {
		event.preventDefault();
		document.location.href="/saved";
	});

	$(document).on("click", ".delete_article", function(event) {
		event.preventDefault();
		var thisId = $(this).attr("data-id");
		$.post("/delete/" + thisId, {})
		.then(function(data) {
			document.location.href="/saved";
		})
		.catch(function(err) {
			return console.log(err);
		});
	});
});