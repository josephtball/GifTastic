// set DOM elements to variables
var $buttonArea = $("#buttonArea");
var $gifArea = $("#gifArea");

// GIPHY API object
var giphy = {
	// Array 
	topics: ["The Godfather", "Pulp Fiction", "Fight Club", "Forrest Gump", "Inception", "The Matrix", "Interstellar", "The Prestige",],
	displayButtons: function() {
		// Clear #buttonArea div
		$buttonArea.empty();
		// Loop through topics array and make a button for each element in array
		for (var i = 0; i < giphy.topics.length; i++) {
			var button = $("<button>");
			button.addClass("movie btn btn-default");
			button.data("name", giphy.topics[i]);
			button.text(giphy.topics[i]);
			$buttonArea.append(button);
		}
		// get .movie elements for onclick function
		$(".movie").on("click", giphy.displayGifs);
	},
	displayGifs: function() {
		// Determine which button was pressed
		var movie = $(this).data("name");
		// Set up URL
		var apiKey = "dc6zaTOxFJmzC";
		var limit = "10"
		var baseURL = "http://api.giphy.com/v1/gifs/search?api_key="+apiKey+"&limit="+limit;
		var queryURL = baseURL+"&q="+movie;
		// Send API request
		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response) {
			// Clear #gifArea div
			$gifArea.empty();
			// Loop through response and create a div with image and rating for each gif
			for (var i = 0; i < response.data.length; i++) {
				var gifDiv = $("<div>");
				gifDiv.addClass("gifDiv");
				var image = $("<img>").attr("src", response.data[i].images.fixed_height_still.url);
				image.addClass("gif");
				image.data("state", "still");
				image.data("still", response.data[i].images.fixed_height_still.url).data("animate", response.data[i].images.fixed_height.url);
				gifDiv.append(image);
				var rating = $("<p>").text("Rating: "+response.data[i].rating);
				gifDiv.append(rating);
				$gifArea.append(gifDiv);
			}
			// get .gif elements for onclick function
			$(".gif").on("click", giphy.stateSwitch);
		});
	},
	stateSwitch: function() {
		console.log("test");
		// Determine state of gif
		var state = $(this).data("state");
		// Set image to still or animate
		switch(state) {
			case "still":
				$(this).attr("src", $(this).data("animate"));
				$(this).data("state", "animate");
				break;
			case "animate":
				$(this).attr("src", $(this).data("still"));
				$(this).data("state", "still");
				break
			default:
		}
	},
	addButton: function() {
		var newMovie = $("#newGifButton").val().trim();
		giphy.topics.push(newMovie);
		giphy.displayButtons();
	},
}
// Display buttons for topics array at start
giphy.displayButtons();
// Onclick function to call addButton function
$("#submit").on("click", function(event) {
	// prevent submit buttons default behavior
	event.preventDefault();
	giphy.addButton();
});