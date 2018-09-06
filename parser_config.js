
module.export = {
	
	// core verbs
	
	// verbs are run through the stemmer before being stored
	verbs: {
		'go':   'move',
		'walk': 'move',
		'move': 'move', 
		'run':  'move',
		
		'attack': 'attack',
		'smite':  'attack',
		'hit':    'attack',
		
		'cast': 'cast',
		
		'take': 'take',
		'pick': 'take',
		'grab': 'take',
		
		'what': 'query',
		
		'look': 'look',
		'search': 'search',
	},
	
	
	action_seq: {
		attack: ['target', {what: 'weapon', prep: 'with'}],
	},
	
	
	
	
	
}






