


module.exports = {
	developer: { // caster
		defaults: {
			ac: 8,
			hp: 40,
			mods: {
				charisma: -1,
				intelligence: 3,
				rhetoric: 1,
				cunning: 1,
				confidence: 0, 
				// slipperyness / weaselyness
				// crazy
				// coordination
			},
			attacks: {
				condescension: { dam: 20 },
				fake_notification: {},
			},
			items: [
				item("smartphone", 1),
				item("laptop", 1),
			],
		},
		hp_per_level: 10,
		
		spells: {},

		
	},
	
	
	secretary: { // charmer
		defaults: {
			ac: 12,
			hp: 20,
			mods: {
				charisma: 4,
				intelligence: 0,
				rhetoric: 0,
				cunning: 2,
				confidence: 2,
			},
		},
		hp_per_level: 5,
		
	},
	
	
	intern: { // trickster
		defaults: {
			ac: 15,
			hp: 15,
			mods: {
				charisma: 2,
				intelligence: 1,
				rhetoric: 1,
				cunning: 3,
				confidence: 0,
			},
			attacks: {
				spill_coffee: {},
			},
		
		},
		hp_per_level: 4,
		

	},
	
	
	marketing: { // fighter
		defaults: {
			ac: 13,
			hp: 35,
			mods: {
				charisma: 1,
				intelligence: 0,
				rhetoric: 3,
				cunning: 2,
				confidence: 4,
				initiative: 1,
			},
		},
		hp_per_level: 7,
		
	},
	
	
	
	
};




function item(name, qty) {
	return {
		id: name,
		qty: qty,
		level: 0,
	};
}



