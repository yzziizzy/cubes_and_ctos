module.exports = addKeys({
	
	// spells:

	hack_emp_database: {
		
	},
	
	sudden_network_outage: {
		
	},
	
	fake_notification: {
		
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
	bureaucracy: {
		hit: { mod: 'rhetoric' },
		dam: [1, /*d*/ 6],
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
		dam: dam([1, /*d*/ 6]),
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

function dam(a) {
	var out = { base: 0, dice: [] };
	
	if(a instanceof Array) out.dice.push(a);
	else if(typeof(a) == 'Object') {
		out = _.extend(out, a);
	}
	else if(typeof(a) == 'Number') {
		out.base = a;
	}
	
	return out;
}
