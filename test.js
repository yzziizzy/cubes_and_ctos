
require('colors');
var util = require('util')


var game = {
	
	dungeon: require('./dungeon.js'),
	monsters: require('./monsters.js'),
	weapons: require('./weapons.js'),
	items: require('./items.js'),
	//weapons: require('./weapons.js'),
	
}



var parser = require('./parser.js')(game);
parser.processGame();


if(process.argv[2] == "parser") {
	
	var parser_input = [
		"izzy attacks with condescension",
		"izzy attacks steve",
		"izzy attacks parking attendant",
		"izzy attacks the parking attendant",
		"izzy attacks the first parking attendant",
		"izzy attacks the 2nd parking attendant",
		"izzy attacks the last parking attendant using condescension",
		"izzy attacks steve with condescension",
		"izzy gives steve the laptop",
		"izzy grabs a few cards",
		"izzy looks around ",
 		"izzy looks around steve",
		"izzy looks around the lawn",
		"izzy looks around the maintenance shed",
	];
	
	
	
	parser_input.map(function(x) {
		var y = parser.parseSentence(x)
		
		console.log("\n\n" + x.green + "\n" + util.inspect(y, false, null, true));
		
	});
	
	
	
}
else if(process.argv[2] == "stemmer") {

	var stemmer_input = [
		'green',
		'greens',
		"green's",
		"steve",
		"steves",
		"steve's",
		"steves'",
		"free",
		"frees",
		"free's",
		"frees'",
	];

	stemmer_input.map(parser.stemmer).map(function(x) {console.log(x)});
}

else if(process.argv[2] == "stripper") {

	var stemmer_input = [
		'.foo', // strip
		'foo.', // strip
		'foo.net', // don't strip
		'foo?><,\'";:[]{}-=+|\\/*&^%$#@!`~net', // strip
	];

	stemmer_input.map(parser.stripper).map(function(x) {console.log(x)});
}




