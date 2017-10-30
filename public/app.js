$(document).ready(function() {

	$("#scrape_button").on("click", function(event) {
		event.preventDefault();
		document.location.href="/scrape";
	});

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

	$(document).on("click", ".note_button", function(event) {
		event.preventDefault();
		$('#note').empty();
		$('#note-text').val('');
		var thisId = $(this).attr("data-note-id");
		var noteId = '';
		$.get("/notes/" + thisId, {})
		.then(function(data) {
			console.log(data);
			$('#note-modal').modal('show');
			if (data.note) {
				$('#note').append("<p id='note-input'>" + data.note.body + "</p>");
				$('#note').append("<button type='button' class='delete-note btn btn-primary'>Delete Note</button>")
				noteId = data.note._id;
			} else {
				console.log("No Note");
			}
		})
		.catch(function(err) {
			return console.log(err);
		});

		$(document).on("click", "#add-note", function(event) {
			event.preventDefault();
			// var thisId = $(this).attr("data-note-id")
			$.post("/addnote/" + thisId, {
				body: $('#note-text').val()
			})
			.then(function(data) {
				console.log(data);
				$('#note-text').val('');
			})
			.catch(function(err) {
				return console.log(err);
			});
			$('#note-modal').modal('hide');
		});

		$(document).on("click", ".delete-note", function(event) {
			event.preventDefault();
			$.post("/deletenote/" + thisId, { _id: noteId })
			.then(function(data) {
				console.log(data);
			})
			.catch(function(err) {
				return console.log(err);
			});
			$('#note').empty();
		});
	});

	/*$(document).on("click", "#add-note", function(event) {
		event.preventDefault();
		var thisId = $(this).attr("data-note-id")
		$.post("/addnote/" + thisId, {
			body: $('#note-text').val()
		})
		.then(function(data) {
			console.log(data);
			$('#note-text').val('');
			$('#note-modal').modal('hide');
		})
		.catch(function(err) {
			return console.log(err);
		});
	});*/
});