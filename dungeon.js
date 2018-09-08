
var Item = require('./Item.js');


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
			/*encounters: [
				{
					intro: "A group of surley parking attendants approach.",
					freq: 'first', // there can only be one first encounter for now
					monsters: [
						{
							name: 'parking_attendant',
							min: 1,
							max: 2,
							drops: [ 'lanyard' ],
						},
						
						
					],
					drops: [
						'parking_pass',
					]
				},
			],*/
			items: [
				
			],
		},
		
		lawn: {
			entry: "You arrive at a grassy lawn.",
			edges: {
				parking_lot: ["A sea of vehicles lies to the west.", 'parking', 'sea', 'lot', 'west'],
				
			},
			features: {
				shed: {
					name: "Maintenance Shed",
					items: [
						Item("gasoline", 5),
						Item("hedge_trimmers", 1),
					],
				},
				sprinkler_controls: {
					name: "Sprinker Controls",
					locked: 'sprinkler_key',
					dc: [25, 'strength'],
					actions: {
						enable: {
							on: 'Turn Sprinkers On',
							off: 'Turn Sprinkers Off',
						},
					},
				},
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
						},
					],
				},
			],
			items: [
				{
					what: 'needle',
					dc: 10,
					freq: 'one_per_visit',
				}
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
			entry: "A cavernous hall surrounds you. Locals call it \"Foyer\".",
			edges: {
				tower_entrance: ["Freedom peeks though a large revolving door.", 'exit', 'leave', 'revolving', 'door'],
				balcony: ["Stairs lead up to a balcony.", 'stairs', 'balcony'],
				elevator: [],
			},
		},
		
		balcony: {
			entry: "balcony",
			edges: {
				foyer: ["Stairs lead down from the overlook.", 'stairs', 'down', 'foyer'],
			},
		},
		
		coffee_shop: {
			entry: "",
			edges: {
				foyer: ["Return to Foyer", 'foyer'],
			},
			for_sale: {
				coffee: {},
				latte: {},
				espresso: {},
				cookie: {},
			},
		},
		
		restrooms: {
			entry: "",
			edges: {
				foyer: ["Exit", 'exit', 'leave', 'revolving', 'door'],
				
			},
		},
		
		
		elevator: {
			entry: "You board the elevator.",
			edges: {
				foyer: ["1", '1', 'one', 'foyer', 'ground'],
				floor_2_hallway: ["2", '2', 'two'],
				floor_3_hallway: ["3", '3', 'three'],
				floor_4_hallway: ["4", '4', 'four'],
				floor_5_hallway: ["5", '5', 'five'],
			}
		},
		
		floor_2_hallway: {
			entry: "The elevator dings. The doors open to Floor Two.",
			edges: {
				
			},
		},
		floor_3_hallway: {
			entry: "The elevator dings. The doors open to Floor Three.",
			edges: {
				
			},
		},
		floor_4_hallway: {
			entry: "The elevator dings. The doors open to Floor Four.",
			edges: {
				
			},
		},
		floor_5_hallway: {
			entry: "The elevator dings. The doors open to Floor Five.",
			edges: {
				
			},
		},
		
	}
	
	
	
	
	
	
	
}
