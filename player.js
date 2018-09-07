
var _ = require('underscore');
var helpers = require('./helpers.js');



function Character(opts) {
	
	var defaults = {
		name: 'Nameless Character',
		level: 1,
		classname: 'unknown',
		
		hp: 1,
		ac: 1,
		mods: {},
		resists: {},
		
		items: [], // an array so there can be items of the same name but different props
		attacks: {}, // you can only equip one weapon of a kind a time. duplicate unequipped weapons will be held in the items list.
		
	};
	
	helpers.deepExtend(this, defaults, opts);
}

module.exports = Character;


// tries to add an item to inventory, returning what was added
Character.prototype.receiveItem = function(item) {
	
};

// tries to give an item to another character, returning what was given
Character.prototype.giveItem = function(item, target) {
	
};

// returns amount of damage taken
Character.prototype.takeDamage = function(amount, type) {
	
};





Character.playerFromClass = function(name, nick, classname) {
	
};

Character.npcFromMonster = function(monster) {
	
};



