

module.exports = {
	start: 'parking_lot',
	
	
	
	locations: {
		parking_lot: {
			entry: "You arrive at the edge of a vast sea of vehicles. It is quiet.",
			edges: {
				lawn: ["There is a grassy lawn to the east.", 'lawn', 'east', 'grass'],
				tower_entrance: ["A large glass tower looms to the north.", 'tower', 'north'],
				highway: ["The roar of traffic can be heard from the south.", 'traffic', 'roar', 'south', 'highway', 'road'],
			},
			monsters: [
				{
					name: 'parking_attendant',
					min: 2,
					max: 4,
				},
				
				
			],
		},
		
		lawn: {
			entry: "You arrive at a grassy lawn.",
			edges: {
				parking_lot: ["A sea of vehicles lies to the west.", 'parking', 'sea', 'lot', 'west'],
				
			},
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
				
			},
		},
		
	}
	
	
	
	
	
	
	
}
