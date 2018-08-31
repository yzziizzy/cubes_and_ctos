var _ = require('underscore');
var irc = require('irc');
require('colors');


var helpers = require('./helpers.js');


function randInt(min, max) {
	return (min + (Math.random() * (max - min))) | 0;
}

function trim(s) {
	return s.replace(/^\s+/, '').replace(/\s+$/, '');
}


var game = {
	channel: '#ministryofsillywalks',
	players: {},
	
	conflict: null,
	
	
	dungeon: require('./dungeon.js'),
	
	classes: require('./classes.js'),
	monsters: require('./monsters.js'),
	
	
}




// ----------------------- combat ----------------------------

 
function attack(player, target, weapon) {
	
	
	
}




function listTargets() {
	
	var targets = game.conflict.targets;
	
	var i = 1;
	for(var t in targets) {
		respond((i + ': ' + t.name + ' (' + t.dist + 'ft)').yellow);
		i++;
	}
	
}



function beginCombat() {
	
	var loc = game.dungeon.locations[game.location];
	var ml = loc.monsters;
	var mon_index = 1;
	
	game.combat = {
		targets: [],
		round: 1,
	};
	
	
	loc.monsters.map(function(mon) {
		var num = randInt(mon.min, mon.max); 
		
		for(var i = 0; i < num; i++) {
			var m = spawnMonster(mon, game.monsters[mon.name]);
			game.combat.targets.push(m);
		}
	
	});
	
	
	function spawnMonster(cfg, proto) {
		
		var q = {
			hp: randInt(),
		};
		
		
		return _.extend({}, proto, q);
	}
	
	
}



// ----------------------- message processing ----------------------------



// returns the player object, or null
function findPlayer(name, nick) {
	var n = game.players[name];
	if(n) return n;
	
	if(nick) {
		n = _.find(game.players, {nick: nick});
		if(n) return n; 
	}
	
	return null;
}

function playerByNick(nick) {
	if(nick) {
		n = _.find(game.players, {nick: nick});
		if(n) return n; 
	}
	
	return null;
}


function pm(name, msg) {
	var p = findPlayer(name)
	if(p) cl.say(p.nick, msg);
}

function respond(msg) {
	console.log(msg)
	cl.say(game.channel, msg);
}

function narrate(msg) {
	cl.say(game.channel, irc.colors.wrap('dark_green', msg));
}



function joinGame(nick, name, classname) {
	
	var p = findPlayer(name, nick);
	if(!p) {
		p = helpers.createPlayer(nick, name, classname);
		game.players[name] = p;
		console.log('JOINED: '.green + nick.bold);
		
		respond(name + ' has joined the game.');
		
	}
	else {
		console.log((nick + ' is already in the game').gray);
		
		pm(name, "you are already in the game");
		
	}
}


var word_list = {
	'go': 'move',
	'walk': 'move',
	'mov': 'move', // stemmer strips e's off the end
	'run': 'move',
}

function stemmer(raw) {
	return raw.replace(/e?s$/, '');
}


function processPlayerCommand(player, raw) {
	var sp = raw.split(' ');
	
	var stem = stemmer(sp[0]);
	var action = word_list[stem];
	
	if(!action) {
		console.log('unknown action: ', sp[0]);
		return ;
		
	}
	
	if(action == 'move') {
		var where = sp[1];
		var found = null;
		
		// check edges
		var cur = game.dungeon.locations[game.location];
		
		for(var e in cur.edges) {
			if(cur.edges[e].indexOf(where) > 0) {
				found = e;
				break;
			}
		}
		
		if(!found) {
			respond("You walk around aimlessly, appearing to be lost.");
			return;
		}
		
		game.location = found;
		arrive();
	}
	
}


function arrive() {
	
	var loc = game.location;
	
	narrate(game.dungeon.locations[loc].entry);
}




function ingest(nick, msg) {
	//console.log(nick, msg);
	
	var cmd_fns = {
		join: function(str) {
			var opts = str.replace(/\s+/, ' ').split(' ');
			//           char name, class
			console.log(opts);
			joinGame(nick, opts[0], opts[1]);
		},
		
		start: function(str) {
			if(nick != 'izzy' && nick != 'Izzy') return;
			
			game.location = game.dungeon.start;
			arrive();
			
		},
		
		fuckoff: function(str) {
			if(nick != 'izzy' && nick != 'Izzy') return;
			cl.disconnect();
		},
		
	};
	
	
	console.log(msg)
	if(msg[0] == '!') {
		var m = msg.match(/^!(\S+)\s*(.*)$/);
		if(!m) {
			console.log("failed match: ", msg);
			return;
		}
		var cmd = m[1];
		
		console.log(m);
		
		if(cmd.length) {
			var fn = cmd_fns[cmd];
			if(fn) {
				fn(m[2]);
			}
			else {
				console.log(('unknown command: "'+cmd+'"').red);
			}
		}
	}
	else if(msg[0] == '-') {
		var m = trim(msg.slice(1));
		
		console.log(m);
		
		if(m.length) {
			var player = playerByNick(nick);
			
			if(player) {
				processPlayerCommand(player, m);
			}
			else {
				console.log('no such player: '.red.bold + nick)
			}
		}
	}
	
}



// ----------------------- network boilerplate ----------------------------



var cl = new irc.Client('irc.foonetic.net', 'manager-san', {
	channels: ['#ministryofsillywalks'],
	autoConnect: false,
	autoRejoin: false,
	encoding: 'UTF-8',
});





// cl.addListener('message', function (from, to, message) {
//     console.log(from + ' => ' + to + ': ' + message);
// });

cl.addListener('pm', function (from, message) {
	ingest(from, message);
});



cl.addListener('message#ministryofsillywalks', function (from, message) {
	ingest(from, message);
});

cl.addListener('action', function (from, to, text, message) {
	//console.log(from, to, text, message);
	ingest(from, "- " + text);
});




cl.addListener('registered', function (from, message) {
	cl.send('MODE', 'manager-san', '+b');
});



cl.addListener('error', function (error) {
	console.log(error);
});


/*
cl.addListener('raw', function (error) {
	console.log("raw\n", error);
});

cl.addListener('selfMessage', function (error) {
	console.log("self\n", error);
});


*/










cl.connect();



