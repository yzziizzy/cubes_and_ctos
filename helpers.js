
var _ = require("underscore");
var classes = require('./classes.js');


module.exports = {
	createPlayer: createPlayer, 
	
}



function createPlayer(nick, playername, classname) {
	console.log(playername, classname)
	var q = {
		name: playername, // character name
		nick: nick,
		class: classname,
		
		level: 1,
	}
	
	var cl = classes[classname];
	if(!cl) {
		return null;
	}
	
	return _.extend({}, cl.defaults, q);
}




function levelUp(player) {
	
	
}
