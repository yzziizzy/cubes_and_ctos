

module.exports = {
	start: 'parking_lot',
	
	
	
	locations: {
		parking_lot: {
			entry: "You arrive at the edge of a vast sea of vehicles.",
			edges: {
				lawn: ["There is a grassy lawn to the east.", 'lawn', 'east', 'grass'],
				tower_entrance: ["A large glass tower looms to the north.", 'tower', 'north'],
				highway: ["The roar of traffic can be heard from the south.", 'traffic', 'roar', 'south', 'highway', 'road'],
			},
			encounters: [
				{
					intro: "A group of surley parking attendants approach.",
					freq: 'first', // there can only be one first encounter for now
					monsters: [
						{
							name: 'parking_attendant',
							min: 2,
							max: 4,
							drops: [ 'parking_pass' ],
						},
						
						
					],
				},
			],
			items: [
				
			],
		},
		
		lawn: {
			entry: "You arrive at a grassy lawn.",
			edges: {
				parking_lot: ["A sea of vehicles lies to the west.", 'parking', 'sea', 'lot', 'west'],
				
			},
			encounters: [
				{
					intro: "A slovenly vagrant wanders out from the bushes. He makes eye contact.",
					freq: 4, 
					monsters: [
						{
							name: 'bum',
							min: 1,
							max: 1,
							drops: [ 'parking_pass' ],
						},
						
						
					],
				},
			],
			
		},
		
		highway: {
			entry: "Cars whiz past at irresponsible speeds. You fear for your life.",
			edges: {
				parking_lot: ["Tranquility can be seen to the north.", 'north', 'parking', 'lot', 'tranquility'],
				
			},
		},
		
		tower_entrance: {
			entry: "You stand before a towering glass edifice. A foreboding spirit is in the air -- evil lies within.",
			edges: {
				parking_lot: ["Safety lies in the sea to the south.", 'parking', 'lot', 'south', 'safety'],
				foyer: ["A revolving door spins ominously in front of you.", 'front', 'forward', 'door', 'enter', 'tower', 'in'],
			},
		},
		
		foyer: {
			entry: "A cavernous hall surrounds you. Locals call it \"Foy'yer\".",
			edges: {
				tower_entrance: ["Freedom peeks though a large revolving door.", 'exit', 'leave', 'revolving', 'door'],
				balcony: ["Stairs lead up to a balcony.", 'stairs', 'balcony'],
				elevators: [],
			},
		},
		
		coffee_shop: {
			entry: "",
			edges: {
				foyer: ["", 'exit', 'leave', 'revolving', 'door'],
				
			},
		},
		
		restrooms: {
			entry: "",
			edges: {
				foyer: ["", 'exit', 'leave', 'revolving', 'door'],
				
			},
		},
		
	}
	
	
	
	
	
	
	
}
