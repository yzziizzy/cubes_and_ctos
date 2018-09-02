var _ = require('underscore');
var fs = require('fs');

var irc = require('irc');
require('colors');


// +1 inspiration to sigsegv for dilbert suggestion

var helpers = require('./helpers.js');


function randInt(min, max) {
	return (min + (Math.random() * (max - min))) | 0;
}

function trim(s) {
	return s.replace(/^\s+/, '').replace(/\s+$/, '');
}


var game = {
// 	channel: '#ministryofsillywalks',
	channel: '#cubes',
	players: {},
	
	conflict: null,
	
	
	dungeon: require('./dungeon.js'),
	
	classes: require('./classes.js'),
	monsters: require('./monsters.js'),
	weapons: require('./weapons.js'),
	
}




// ----------------------- combat ----------------------------

// should be possessivize
function pluralize(msg) {
	// TODO: fix
	return msg + "'s";
}

function fillText(user, target, text) {
	return text.replace('%user', user.name)
		.replace('%user\'s', pluralize(user.name))
		.replace('%target', target.name)
		.replace('%target\'s', pluralize(target.name))
}


function attack(user, target, weaponname) {
	var msg;
	var w = helpers.applyUserWeaponMods(user, weaponname);
	
	// hit odds
	var hitroll = helpers.advRoll(20, 0);
	hitroll += user.mods[w.hit.mod]|0;
	
	// armor odds
	var armor = target.ac | 0;
	
	console.log(hitroll, armor);
	
	if(hitroll > armor) {
		// hit
		var d = helpers.rollDice(w.dam);
		target.hp = Math.max(0, target.hp - d);
		
		msg = target.hp == 0 ? w.critical[0] : w.success[0]; 
		
		respond(fillText(user, target, msg).magenta);
		
		if(target.hp == 0) {
		
			// TODO: increase exp
			
			// TODO: death notification, list combatants
			
			// TODO: check for end of combat
			
			
			listTargets();
		}
	}
	else {
		// miss
		msg = w.failure[0];
		respond(fillText(user, target, msg).magenta);
	}
	
}




function listTargets() {
	
	var targets = game.conflict.targets;
	
	var i = 1;
	for(var ti in targets) {
		var t = targets[ti];
		var prefix = i;
		var color = 'yellow';
		if(t.hp <= 0) {
			prefix = 'X';
			color = 'gray';
		}
		
		
		respond((prefix + ': ' + t.name /*+ ' (' + t.dist + 'ft)'*/)[color]);
		i++;
	}
	
}



function beginCombat(encounter) {
	
	console.log('beginning combat'.yellow);
	respond('\x037' + encounter.intro + '\x038sdfsdf');
	
// 	var loc = game.dungeon.locations[game.location];
	var ml = encounter.monsters;
	var mon_index = 1;
	
	game.conflict = {
		targets: [],
		round: 1,
		
	};
	
	
	ml.map(function(mon) {
		var num = randInt(mon.min, mon.max); 
		
		for(var i = 0; i < num; i++) {
			var m = spawnMonster(mon, game.monsters[mon.name]);
			game.conflict.targets.push(m);
		}
		
	});
	
	
	function spawnMonster(cfg, proto) {
		
		var q = {
			name: proto.name,
		};
		
		
		return _.extend({}, proto.defaults, q);
	}
	
	
	// roll initiative
	
	
	
	
}


function checkEncounter() {
	
	var loc = game.dungeon.locations[game.location];
	
	if(!loc.encounters || loc.encounters.length == 0) {
		respond("It is quiet.".green);
		return;
	}
	
	// look for first encounters
	var encounter;
	for(var i = 0; i < loc.encounters.length; i++) {
		if(loc.encounters[i].freq == 'first') {
			encounter = loc.encounters[i];
			break;
		}
	}
	
	if(!encounter) {
		// check for random encounter
		
		// TODO:
	}
	
	
	if(encounter) {
		
		beginCombat(encounter);
		
		listTargets();
	}
	else {
		console.log('no encounter found.'.yellow);
	}
}


// ----------------------- player utils ----------------------------


function pmInfo(player) {
	if(!player) return;
	
	pm_nick(player.nick, "----------")
	pm_nick(player.nick, "name: ".bold + player.name);
	pm_nick(player.nick, "class: ".bold + player.class);
	pm_nick(player.nick, "motivation: ".bold + player.hp);
	
}
function pmStats(player) {
	if(!player) return;
	
	pm_nick(player.nick, "----------")
	pm_nick(player.nick, "motivation: ".bold + player.hp);
	
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
//	console.log(msg)
	cl.say(game.channel, msg);
}

function pm_nick(nick, msg) {
//	console.log(msg)
	cl.say(nick, msg);
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
	'attack': 'attack',
	'smit': 'attack',
	'hit': 'attack',
	//'cast': 'cast' // different parsing semantics
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
	else if(action == "attack") {
		if(game.conflict == null) {
			respond("You are not in combat right now".red);
			return;
		}
		
		// parse the command
		var weaponname;
		var target;
		
		// try to find the weapon
		for(var i = 0; i < sp.length - 1; i++) {
			if(sp[i] == 'with') {
				weaponname = sp[i+1]; // TODO: levenstein distance error correction 
			}
		}
		
		// try to find a target 
		//  HACK: choose the first one for now
		for(var i = 0; i < game.conflict.targets.length; i++) {
			if(game.conflict.targets[i].hp > 0) {
				target = game.conflict.targets[i];
				break;
			}
		}
		
		attack(player, target, weaponname);
	}
	
}


function arrive() {
	
	var loc = game.dungeon.locations[game.location];
	
	narrate(loc.entry);
	
	checkEncounter();
	
	
}




function ingest(nick, msg) {
	//console.log(nick, msg);
	
	// normalize whitespace
	msg = msg.replace(/\s+/g, ' ');
	
	var cmd_fns = {
		join: function(str) {
			var opts = str.replace(/\s+/, ' ').split(' ');
			//           char name, class
			console.log(opts);
			joinGame(nick, opts[0], opts[1]);
			
			// color test
			//respond('\x03000 \x03011 \x03022 \x03033 \x03044 \x03055 \x03066 \x03077 \x03088 \x03099  \x031010 \x031111 \x031212 \x031313 \x031414 \x031515');
		},
		
		stats: function(str) {
			pmStats(playerByNick(nick));
		},
		info: function(str) {
			pmInfo(playerByNick(nick));
		},
		
		start: function(str) {
			if(nick != 'izzy' && nick != 'Izzy') return;
			
			game.location = game.dungeon.start;
			arrive();
			
		},
		
		save: function(str) {
			if(nick != 'izzy' && nick != 'Izzy') return;
			
			fs.writeFileSync('./savefile.js', JSON.stringify(game), 'utf-8');
		},
		
		load: function(str) {
			if(nick != 'izzy' && nick != 'Izzy') return;
			
			game = JSON.parse(fs.readFileSync('./savefile.js', 'utf-8'));
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
// 	channels: ['#ministryofsillywalks'],
	channels: ['#cubes'],
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

cl.addListener('message#cubes', function (from, message) {
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

