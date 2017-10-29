$(document).ready(function() {
	$("#scrape_button").on("click", function(event) {
		event.preventDefault();

		$.get('/scrape', {})
		.then(function(data) {
			/*console.log(data);*/
		})	
		.catch(function(err) {
			console.log(err);
		});

		/*$.ajax({
			method: "GET",
			url: "/scrape"
		})
		.done(function(data) {
			console.log(data);
		})
		.catch(function(err) {
			console.log(err);
		});*/
	});

	$("#title_brand").on("click", function(event) {
		event.preventDefault();
		console.log("worked");
	})
});