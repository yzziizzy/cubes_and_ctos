
var _ = require("underscore");
var classes = require('./classes.js');
var weapons = require('./weapons.js');


module.exports = {
	createPlayer: createPlayer, 
	levelUp: levelUp,
	applyUserWeaponMods: applyUserWeaponMods,
	
	rollInitiative: rollInitiative,
	nRoll: nRoll,
	advRoll: advRoll,
	multiRoll: multiRoll,
	multiRollList: multiRollList,
	rollDice: rollDice,
	
	deepExtend: deepExtend,
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


function applyUserWeaponMods(user, weaponname) {
	var w = _.extend({}, weapons[weaponname]);
	
// 	var a = classes[user.class].attacks[weaponname];
	var a = user.attacks[weaponname];
	if(!a) return w;
	
	if(a.dam) {
		if(typeof(a.dam) == 'Number') {
			w.dam.base += a.dam;
		}
		else if(a.dam instanceof Array) {
			w.dam.dice.push(a.dam);
		}
		else if(typeof(a.dam) == 'Object') {
			_.extend(w.dam, a.dam)
		} 
	}
	
	
	return w;
}


function rollInitiative(player) {
	// TODO: advantage
	player.initiative = nRoll(20) + (player.mods.initiative|0);
}


function nRoll(sides) {
	return Math.round((Math.random() * (sides - 1))) + 1;
}

function advRoll(sides, adv) {
	var a = nRoll(sides);
	var b = nRoll(sides);
	if(adv > 0) return Math.max(a, b);
	if(adv < 0) return Math.min(a, b);
	return a;
}

function multiRoll(num, sides) {
	var sum = 0;
	for(var i = 0; i < num; i++) sum += nRoll(sides);
	return sum;
}

function multiRollList(list) {
	var sum = 0;
	for(var i = 0; i < list.length; i++) {
		sum += multiRoll(list[i][0], list[i][1]);
	}
	return sum;
}

function rollDice(opt) {
	return opt.base|0 + multiRollList(opt.dice);
}


function _de(a, b) {
	for(var k in b) {
		if(a[k] instanceof Array) {
			if(b[k] == null || b[k] == undefined) {
				continue;
			}
			else if(b[k] instanceof Array) {
				a[k] = a[k].concat(b[k]);
				continue;
			}
			else {
				// append to array? 
			}
		}
		else if(typeof a[k] == 'Object') {
			if(b[k] == null || b[k] == undefined) {
				continue;
			}
			else if(typeof b[k] == 'Object') {
				_de(a[k], b[k]);
				continue;
			}
		}
		
		// overwrite is can't be combined
		a[k] = b[k];
	}
}

function deepExtend() {
	var args = arguments;
	
	for(var i = 1; i < args.length; i++) {
		_de(args[0], args[i]);
	}
	
	return args[0];
}
