
module.export = {
	
	// core verbs
	
	// verbs are run through the stemmer before being stored.
	// these are the verbs understood as actions by the game. 
	// it is not an exhaustive grammatical list of all verbs.
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
	
	
	
	adjectives: {
		
		// colors
		red: {},
		orange: {},
		yellow: {},
		green: {},
		blue: {},
		purple: {},
		pink: {},
		brown: {},
		black: {},
		grey: {},
		gray: {},
		white: {},
		violet: {},
		maroon: {},
		magenta: {},
		lime: {},
		navy: {},
		gold: {}, //    in most rpgs these would be coins,
		silver: {}, //  but nobody carries bullion around an office
		bronze: {},
		
		dark: {},
		light: {},
		pastel: {},
	
		// quantity
		all: {},
		most: {},
		many: {},
		some: {},
		few: {},
		
		// order
		first: {},
		last: {},
		second: {},
		third: {},
		fourth: {},
		fifth: {},
		sixth: {},
		seventh: {},
		eigth: {},
		ninth: {},
		tenth: {},
		
		// numbers
		one: {},
		two: {},
		three: {},
		four: {},
		five: {},
		six: {},
		seve: {},
		eight: {},
		nine: {},
		ten: {},
		eleven: {},
		twelve: {},
		thirteen: {},
		fourteen: {},
		fifteen: {},
		sixteen: {},
		seventeen: {},
		eighteen: {},
		nineteen: {},
		twenty: {},
		thirty: {},
		forty: {},
		fifty: {},
		sixty: {},
		seventy: {},
		eighty: {},
		ninety: {},
		hundred: {},
		thousand: {},
		million: {},
		billion: {},
		trillion: {},
		quadrillion: {},
		quintillion: {},
		
		// size
		microscopic: {},
		ittybitty: {},
		minuscule: {},
		subatomic: {},
		tiny: {},
		wee: {},
		teeny: {},
		bitesized: {},
		teensy: {},
		minute: {},
		compact: {},
		scrawny: {},
		anemic: {},
		mini: {},
		micro: {},
		nano: {},
		pico: {},
		shrunken: {},
		short: {},
		chibi: {},
		puny: {},
		little: {},
		pygmy: {},
		baby: {},
		small: {},
		dwarfed: {},
		bitty: {},
		petite: {},
		diminutive: {},
		medium: {},
		goodsized: {},
		'super': {},
		large: {},
		sizable: {},
		great: {},
		big: {},
		huge: {},
		fat: {},
		obese: {},
		giant: {},
		mega: {},
		enormous: {},
		massive: {},
		titanic: {},
		mammoth: {},
		immense: {},
		colossal: {},
		humongous: {},
		vast: {},
		tall: {},
		ginormous: {},
		gargantuan: {},
		tremendous: {},
		supercolossal: {},
		monumental: {},
		ultra: {},
		uber: {},

	}
	
	
}






