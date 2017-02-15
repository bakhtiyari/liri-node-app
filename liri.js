var fs = require("fs");
var spotify = require("spotify");
var request = require("request");
var Twitter = require("twitter");
var keys = require("./keys.js");

// Takes in all of the command line arguments
var inputString = process.argv;

// Parses the command line argument to capture
// the "command" (my-tweets, spotify-this-song, movie-this, do-what-it-says) and
// the related "parameters" for the commands (song name, movie name)
var command = inputString[2];
var parameter = inputString[3];

// Replacing white spaces with "+" for the title in case the title has more than one word
for (var i = 4; i < inputString.length; i++) {
	parameter += "+" + inputString[i];
}

//switch statement to provoke the related function based on the command entered
switch (command) {

	case "spotify-this-song":
	spotifyThisSong(parameter);
	break;

	case "movie-this":
	omdbThisMovie(parameter);
	break;

	case "my-tweets":
	showMyTweets();
	break;

	case "do+what-it-says":
	doWhatItSays();
	break;

	default:
	console.log("Please enter a valid commands");
}

function spotifyThisSong(song) {
	//getting the song info, if no song is provided then "The Sign Ace of Base" will be the default song
	spotify.search({ type: "track", query: song || "The Sign Ace of Base"}, function(err, data) {

	    if ( err ) {
	        console.log("Error occurred: " + err);
	        return;
	    }
	 
	    if(data.tracks.items.length > 0) {
	    	// The object with the info we need
	        var record = data.tracks.items[0];
	        // Getting the Name, Artist, Album, and Link properties
	        var songName = record.name;
	        var songArtist = record.artists[0].name;
	        var songAlbum = record.album.name;
	        var songLink =  record.preview_url
	        // Creating template literal
	        var strTemplateLiteral = `\n---------------- Song Info ----------------\nName:   ${songName}\nArtist: ${songArtist}\nAlbum:  ${songAlbum}\nLink:   ${songLink}\n-------------------------------------------\n`;
	        // Displaying the info in console
	        console.log(strTemplateLiteral);

	        // Appending the info to the text file
	        outputDataToFile(strTemplateLiteral);

	    } else {
	        console.log("No song data found.");
	    }
	});
}

function omdbThisMovie(movie) {
 	//getting the movie info, if no movie is provided then "Mr.Nobody" will be the default movie
	var query_url = "http://www.omdbapi.com/?t=" + (movie || "Mr.Nobody") +"&y=&plot=long&tomatoes=true&r=json";

	request(query_url, function(error, res, body) {

		if (!error && res.statusCode == 200) {
			// The object with the info we need
			var record = JSON.parse(body);
			var movieTitle = record.Title;
			var movieReleased = record.Released;
			var movieimdbRating = record.imdbRating;
			var movieCountry = record.Country;
			var movieLanguage = record.Language;
			var moviePlot = record.Plot;
			var movieActors = record.Actors;
			var movietomatoRating = record.tomatoRating;
			var movietomatoURL = record.tomatoURL;

			var strTemplateLiteral = `\n---------------- Movie Info ---------------\nTitle:                  ${movieTitle}\nReleased:               ${movieReleased}\nIMDB Rating:            ${movieimdbRating}\nCountry:                ${movieCountry}\nLanguage:               ${movieLanguage}\nPlot:                   ${moviePlot}\nActors:                 ${movieActors}\nRotten Tomatoes Rating: ${movietomatoRating}\nRotten Tomatoes URL:    ${movietomatoURL}\n--------------------------------------------\n`;
			// Displaying the info in console
	        console.log(strTemplateLiteral);

	        // Appending the info to the text file
	        outputDataToFile(strTemplateLiteral);
		}

		else {
			console.log("in error");
			console.error(error);
		}
	});
}

function showMyTweets() {
	var client = new Twitter(keys.twitterKeys);
	client.get('statuses/user_timeline', function(error, tweets, response) {
		if (!error) {
			
			var topCosmeticLine = `\n------------------- My Tweets ------------------`;
			console.log(topCosmeticLine);
	        outputDataToFile(topCosmeticLine);

			var tweetTime, tweetText;

			tweets.forEach(function(obj) {

				tweetTime = obj.created_at;

				tweetText = obj.text;

				var strTemplateLiteral = `\n____________________________________________\nTime:  ${tweetTime}\nTweet: ${tweetText}\n____________________________________________\n`;

				// Displaying the info in console
				console.log(strTemplateLiteral);

		        // Appending the info to the text file
		        outputDataToFile(strTemplateLiteral);
			});

			var bottomCosmeticLine = `-----------------------------------------------\n`;
			console.log(bottomCosmeticLine);
	        outputDataToFile(bottomCosmeticLine);
		} 

		else {
			console.log(error);
		}
	});
}

function doWhatItSays() {

	// Reading the random.txt file
	fs.readFile("random.txt", "utf8", function(err, data) {

		var textArray = data.split(",");

		var aCommand = textArray[0];

		var aParameter = textArray[1];

		switch (aCommand) {

			case "spotify-this-song":
			spotifyThisSong(aParameter);
			break;

			case "movie‐this":
			omdbThisMovie(aParameter);
			break;

			case "my‐tweets":
			showMyTweets();
			break;

			default:
			console.log("random.txt is not valid");
		}
	});
}

// Outputing the data to log.txt.
function outputDataToFile(dataToBeWritten) {

	fs.appendFile("log.txt", dataToBeWritten, function(err) {
		
		if(err) {
			console.log(err);
		}
		
		else {
			console.log("Content Added to the log file.");
		}
	});
}

