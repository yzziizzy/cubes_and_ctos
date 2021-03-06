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
	pastConflicts: [],
	
	dungeon: require('./dungeon.js'),
	
	classes: require('./classes.js'),
	monsters: require('./monsters.js'),
	weapons: require('./weapons.js'),
	armor: require('./armor.js')(),
	
}



var parser = require('./parser.js')(game);

var npc_combat = require('./npc_combat.js')(game, attack /*temp*/);


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
	console.log('-----', weaponname, w, user, target);
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
		
		respond(fillText(user, target, msg).magenta + " " + ('-' + d).red);
		pm_nick(target.nick, ("Your hp: " + target.hp).red.bold);
		
		
		if(target.hp == 0) {
		
			// TODO: increase exp
			
			
			if(!target.nick) {
				game.conflict.remainingTargets--;
				listTargets();
			}
			else {
				game.conflict.remainingPlayers--;
			}
			respond((target.name + " has died.").red.bold);
			pm_nick(target.nick, "You are dead.".red.bold);
		}
	}
	else {
		// miss
		msg = w.failure[0];
		respond(fillText(user, target, msg).magenta);
	}
	
}

function advanceCombatTurn() {
	var con = game.conflict;
	con.turnIndex++;
	
	if(con.turnIndex >= con.combatants.length) {
		// end of round
		con.round++;
		
		con.turnIndex = 0;
		
		respond(("Round " + con.round).gray);
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
	respond(encounter.intro.yellow.bold);
	
// 	var loc = game.dungeon.locations[game.location];
	var ml = encounter.monsters;
	var mon_index = 1;
	
	var con = game.conflict = {
		targets: [],
		players: [],
		combatants: [],
		
		round: 1,
		turnIndex: 0, // which combatant's turn it is now 
		remainingTargets: 0,
		remainingPlayers: 0,
		
		location: game.location,
	};
	
	
	// add players
	for(var k in game.players) {
		con.players.push(game.players[k]);
	}
	
	
	// add monsters
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
			mods: {},
		};
		
		return _.extend({}, proto.defaults, q);
	}
	
	
	
	// calculate initiative
	con.combatants = con.players.concat(con.targets);
	
	con.combatants.map(helpers.rollInitiative);

	con.combatants = _.sortBy(con.combatants, 'initiative').reverse();
	
	
	//
	con.remainingPlayers = con.players.length;
	con.remainingTargets = con.targets.length;

	listTargets();

	runCombat();
}


// processes npc combat turns until prompting the next player
function runCombat() {
	
	var con = game.conflict;
	var p = con.combatants[con.turnIndex];
	
	// end combat
	if(con.remainingPlayers == 0 || con.remainingTargets == 0) {
		return endCombat();
	}
	
	// skip the dead 
	if(p.hp == 0) {
		advanceCombatTurn();
		
		return runCombat();
	}
	
	
	
	
	
	if(p.nick) { // human player
		
		//listTargets();
		
		respond((p.nick + ", it is your turn.").yellow.bold);
		
		return;
	}
	else { // npc
		
		
		npc_combat.npcAttack(con.combatants[con.turnIndex]);
		
		
		advanceCombatTurn();
		return runCombat();
		
	}
	
	// check to see if any combatants died
	for(var i = 0; i < con.combatants.length; i++) {
		var c = con.combatants[i];
		if(c.hp == 0) {
			
			
		}
	}
	
	// TODO: advance the round
	
}


// TODO: everything here
function endCombat() {
	
	respond("The fight is over".green);
	
	game.pastConflicts.push(game.conflict);
	game.conflict = null;
	
	// TODO: mark off 'first' encounters
	
	
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
		
	}
	else {
		console.log('no encounter found.'.yellow);
	}
}




// ----------------------- interaction ----------------------------

function give(player, itemname, count) {
	// TODO: look up and combine with existing items
	
	player.items.push({
		id: itemname,
		qty: count,
		level: 0,
	})
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

function notice(nick, msg) {
//	console.log(msg)
	if(nick) cl.notice(nick, msg);
}

function pm_nick(nick, msg) {
//	console.log(msg)
	if(nick) cl.say(nick, msg);
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
	'tak': 'take',
	'pick': 'take',
	
	'what': 'query',
	
	'look': 'look',
	'search': 'search',
	
	'share': 'share',
}

function stemmer(raw) {
	return raw.replace(/e?s$/, '');
}


function extractVerb(tree) {}

function findVerbAction(dia) {
	if(!dia || !dia.verb) return false;
	
	return word_list[dia.verb.verb.verb]; // yes, 3 layers deep
	
}

function findDirectObject(dia) {
	if(!dia || !dia.dobj || !dia.dobj.noun) return false;
	
	return dia.dobj.noun.noun;
}

function findPrepObject(dt, preplist) {
	if(!dt) return false;
	
	//return dia.dobj.noun.noun;
}




function processPlayerCommand(player, raw) {
	
	var dia = parser.parse(raw);
	var action = findVerbAction(dia);
	
	if(!action) {
		console.log('unknown action: ', sp[0]);
		respond((player.name + ': huh?').red);
		return;
	}
	
	console.log('action: '.green + action)
	
	
	if(action == 'move') {
		var where = findDirectObject(dia);
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
		var target; // 
		
		// try to find the weapon - object of a preposition on the direct object
		weaponname = dia.dobj.preps[0].obj.noun;
		// TODO: fuzzy match names, including abbreviations, prefixes, and postfixes
		
		if(!game.weapons[weaponname]) {
			respond(("No such weapon: " + weaponname).red);
			return;
		}
		
		
		// try to find a target - direct object 
		// = findDirectObject(dia);;
		//  HACK: choose the first one for now
		/*
		for(var i = 0; i < game.conflict.targets.length; i++) {
			if(game.conflict.targets[i].hp > 0) {
				target = game.conflict.targets[i];
				break;
			}
		}
		*/
		
		// BUG: crashes when all targets are dead
		
		attack(player, target, weaponname);
		
		advanceCombatTurn();
		runCombat();
	}
	else if(action == "look") {
		// TODO: check for specific locations to check: "in the shed"
		var loc = game.dungeon.locations[game.location];
		narrate(loc.entry);
		narrateEdges();
	}
	else if(action == "search") {
		// look for hidden items
		// TODO: check for specific locations to check: "in the shed"
		var loc = game.dungeon.locations[game.location]
		
		var found = false;
		_.each(loc.items, function(item) {
			if(helpers.nRoll(20) >= item.dc) {
				give(player, item.what, item.count);
				item.given = item.given || 0;
				item.given += item.count;
				
				narrate(player.name + ' finds ' + item.count + 'x ' + game.items[item.what].name);
				
				found = true;
			}  
		})
		
		if(found == false) {
			narrate(player.name + 'finds nothing.');
		}
		
		// mark this location as searched
		loc.searched = true;
		
	}
	else {
		respond((player.name + ': huh?').red);
	}
	
}


function arrive() {
	
	var loc = game.dungeon.locations[game.location];
	
	narrate(loc.entry);
	
	checkEncounter();
	
	
}

function narrateEdges() {
	var loc = game.dungeon.locations[game.location];
	for(var i in loc.edges) {
		var e = loc.edges[i];
		narrate(e[0]);
	}
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
			
			if(Object.keys(game.players).length == 0) {
				respond("No players have joined".red.bold);
				return;
			}
			
			parser.processGame();
			
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
	ingest(from, "-" + from + " " + text);
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

