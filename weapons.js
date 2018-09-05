module.exports = addKeys({
	
	// spells:
	
	disable_lock: {
		
	},
	
	hack_employee_database: {
		
	},
	
	sudden_network_outage: {
		name: "Sudden Network Outage",
		desc: "Causes a temporary network outage for all enemies.",
		spell_level: 1,
		/* TODO:
		effects: [
			{ , duration: 3 /*turns * / },
		],
		*/
		requires: {
			any: ['laptop'],
		},
		
		success: [
			"%user causes a temporary network outage.",
		],
		failure: [
			"%user's spell fails.",
		],
	},
	
	fake_porn: {
		name: "Fake Porn",
		desc: "Creates false evidence that the target was browsing porn at work.",
		spell_level: 3,
		effects: [
			{ what: 'damage', dam: dam([2,8], 'bureaucratic'), duration: 1 /*turns*/ },
		],		
		requires: {
			any: ['laptop'],
		},
		
		success: [
			"%target is framed for porn browsing.",
		],
		failure: [
			"%user's spell fails.",
		],
	},
	
	
	fake_notification: {
		name: "Fake Notifications",
		desc: "Target becoms distracted by a series of fake notifications.",
		spell_level: 0,
		effects: [
			{ what: 'disadvantage', on: ['attack', 'defense'], duration: 3 /*turns*/ },
		],
		requires: {
			any: ['smartphone', 'laptop'],
		},
		
		success: [
			"%user conjures an endless stream of useless notifications onto %target.",
		],
		failure: [
			"%user's spell fails.",
		],
	},
	
	jargon: {
		
	},
	
	buzzwords: {
		
	},
	
	ddos: {
		
	},
	
	agile: {
		
	},
	scrum: { // like agile, but more hip
		
	},
	
	/*
	lawsuit: {
		
	}*/
		
	
	
	// attacks: 
		
	// general attacks
	bribe: {
		
		
	},
	
	
	boring_smalltalk: {
		hit: { mod: 'rhetoric' },
		dam: dam([1, /*d*/ 4], 'motivation'),
		success: [
			"%user bores %target with inane smalltalk.",
		],
		failure: [
			"%target ignores %user's yapping.",
		],
		critical: [
			"%target is sucked into an endless conversation about %user's dogs.",
		],
	},
	
	
	panhandling: {
		hit: { mod: 'rhetoric' },
		dam: dam([1, /*d*/ 4]),
		failcb: function(user, target) {
			// subtract money or items
		},
		success: [
			"%user leeches some coins and self-respect from %target.",
		],
		failure: [
			"%target replies, 'Get a job, sluggard.'",
		],
		critical: [
			"%target is overwhelmed with false compassion, dedicating the rest of their life to subsidizing the lazy.",
		],
	},
	
	bum_harass: {
		hit: { mod: 'crazy' },
		dam: dam([1, /*d*/ 6], 'intimidation'),
		success: [
			"%user screams randomly at %target.",
		],
		failure: [
			"%user's incoherent ranting is ignored.",
		],
		critical: [
			"%target frantically flees %user's insanity.",
		],
	},
	
	
	bureaucracy: {
		hit: { mod: 'rhetoric' },
		dam: dam([1, /*d*/ 6], 'motivation'),
		success: [
			"%target has become mired in paperwork.",
		],
		failure: [
			"%user's words seem to have no effect.",
		],
		critical: [
			"The mountains of paperwork crush %target's will to live.",
		],
	},
	
	peer_pressure: {
		
	},
	
	insults: {
		
	},
	
	boring_smalltalk: {
		
	},
	
	discrimination_accusation: {
		
	},
	
	flirt: {
		
	},
	
	condescension: {
		hit: { mod: 'intelligence' },
		dam: dam([1, /*d*/ 6], 'self-esteem'),
		success: [
			"%user's sarcastic words cut into %target's self esteem.",
		],
		failure: [
			"%user's words seem to have no effect.",
		],
		critical: [
			"%user's unbearable superiority crushes %target's will to live.",
		],
	},
	
	spill_coffee: {
		name: "Spill Coffee",
		desc: "Intentionally spill a beverage on the target.",
		hit: { mod: 'coordination' },
		dam: dam([1, /*d*/ 6], 'motivation'),
		uses: {
			any: [
				{item:'coffee', num: 1},
				{item:'latte', num: 1},
				{item:'espresso', num: 1},
			],
		},
		
		success: [
			'%user "accidentally" spills a beverage on %target.',
		],
		failure: [
			"%user clumsily spills a beverage on the ground.",
		],
		critical: [
			"%target's wardrobe is completely ruined by %user's beverage, leaving to change.",
		],
	},
	
	
	
	bro_down: {
		
	},
	
	
	// used by managers mostly
	
	performance_review: {
		
	},
	
	standup_meeting: {
		
	},
	
	surprise_meeting: {
		
	},
	
	training_class: {
		
	},
	
	mentoring: {
		
	},
	
	drive_by_managing: {
		
	},
	
	// micromanaging as a buff?
	
	nonmonetary_reward: {
		
	},
	
	scope_creep: {
		
	},
	

	
	
	
})


function addKeys(o) {
	
	for(var k in o) {
		o[k].key = k;
	}
	
	return o;
}

function dam(a, type) {
	var t = type || 'motivation'; // TODO: appropriate default damage type?
	var out = { base: 0, dice: [], type: t }; 
	
	if(a instanceof Array) out.dice.push(a);
	else if(typeof(a) == 'Object') {
		out = _.extend(out, a);
	}
	else if(typeof(a) == 'Number') {
		out.base = a;
	}
	
	return out;
}
