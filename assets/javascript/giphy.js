// set DOM elements to variables
var $buttonArea = $("#buttonArea");
var $gifArea = $("#gifArea");

// GIPHY API object
var giphy = {
	// Array 
	topics: ["Happy", "Sad", "Afraid", "Mad", "Curious", "frustrated", "Pleased", "Confident", "Giddy", "Excited"],
	displayButtons: function() {
		// Clear #buttonArea div
		$buttonArea.empty();
		// Loop through topics array and make a button for each element in array
		for (var i = 0; i < giphy.topics.length; i++) {
			var button = $("<button>");
			button.addClass("movie btn btn-primary");
			button.data("name", giphy.topics[i]);
			button.text(giphy.topics[i]);
			$buttonArea.append(button);
		}
		// Get .movie elements for onclick function
		$(".movie").on("click", giphy.displayGifs);
	},
	displayGifs: function() {
		// Determine which button was pressed
		var movie = $(this).data("name");
		// Set up URL
		var apiKey = "dc6zaTOxFJmzC";
		var limit = "10"
		var baseURL = "https://api.giphy.com/v1/gifs/search?api_key="+apiKey+"&limit="+limit;
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
				image.addClass("gif img-responsive");
				image.data("state", "still");
				image.data("still", response.data[i].images.fixed_height_still.url).data("animate", response.data[i].images.fixed_height.url);
				gifDiv.append(image);
				var rating = $("<p>").text("Rating: "+response.data[i].rating.toUpperCase());
				// Set a class for R rated gifs to distinguish them from others
				if (response.data[i].rating === "r") {
					rating.addClass("red");
				}
				gifDiv.append(rating);
				$gifArea.append(gifDiv);
			}
			// Get .gif elements for onclick function
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
		// Get string from innput field
		var newMovie = $("#newGifButton").val().trim();
		// Capitalize first letters in all words
		newMovie = newMovie.toLowerCase().split(" "); // Turn newMovie into an array of words
		for (var i = 0; i < newMovie.length; i++) {
			newMovie[i] = newMovie[i].split(""); // Turn the word at position i into an array of letters
			newMovie[i][0] = newMovie[i][0].toUpperCase();	// Capitalize the first letter
			newMovie[i] = newMovie[i].join(""); // Join the array of letters back into a word
		}
		newMovie = newMovie.join(" "); // Join the array of words back into a single string
		giphy.topics.push(newMovie);
		giphy.displayButtons();
		$("#newGifButton").val("");
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