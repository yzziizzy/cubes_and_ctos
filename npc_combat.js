module.exports = function(game, attack) {
	return {
		npcAttack: npcAttack,
	};
	
	
	function chooseRandom(arr) {
		var n = Math.round(Math.random() * (arr.length - 1));
		return arr[n];
	}
	
	
	
	function npcAttack(npc) {
		
		// choose a weapon
		var wavail = Object.keys(npc.attacks);
		var wname = chooseRandom(wavail);
		console.log("wname", wname);
		
		// choose a target
		if(!npc.currentTarget || npc.currentTarget.hp <= 0) {
			// TODO: filter out dead players
			npc.currentTarget = chooseRandom(game.conflict.players);
		}
		
		
		console.log(npc, wavail);
		
		attack(npc, npc.currentTarget, wname);
		
	}
	
	
	
	
	
	
	
	
}

