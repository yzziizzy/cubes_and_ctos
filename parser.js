
var levenshtein = require('fast-levenshtein').get;
var _ = require('underscore');


module.exports = function(game) {

		
	var lex = {
		start_word: {},
		pos: {},
		players: {},
		monsters: {},
		items: {},
		weapons: {},
	};
	


	
	/*
	<builtin>
	(optional)
	list...
	
	sentence = subject verb
	sentence = subject verb direct_object
	sentence = subject verb indirect_object direct_object
	
	subject = noun
	direct_object = noun
	indirect_object = noun
	
	noun = noun
	noun = noun_clause
	noun = adjective noun

	
	verb = verb
	verb = adverb verb
	
	adjective = adjective
	adjective = adverb adjective
	adjective = adjective_phrase
	
	adverb = adverb
	adverb = adverb adverb
	adverb = adverb_phrase
	
	*/
	
	
	
	var sample = {
		
	}
	
	
	function parse(raw) {
		
		var list = wordSplit(raw.toLowerCase()).map(stemmer);
		
		return parseSentence(list);
	}
	
	function parseSentence(list) {
		
		// only active verb forms are considered
		//sentence = subject verb
		//sentence = subject verb direct_object
		//sentence = subject verb indirect_object direct_object
		
		var s = parseSubject(list);
		if(r === false) { 
			console.log('parser: [sentence] failed to find subject');
		}
		
	//	console.log('subject', s);
		
		var v = parseSentVerb(s.remain);
		if(v === false) { 
			console.log('parser: [sentence] failed to find verb');
		}
	//	console.log('sentverb', v);
	
		// detect phrasal verbs using prepositions
		var verb_preps = [];
		var l = v.remain;
		do {
			var p = parsePrepPhrase(l);
			if(p) {
				l = p.remain;
				verb_preps.push(p);
			}
		} while(p);

		
		var iobj = parseIndirectObject(l);
		var r;
		if(iobj === false) { 
			console.log('parser: [sentence] failed to find indirect object');
			r = v.remain;
		}
		else r = iobj.remain;
		
		var dobj = parseDirectObject(r);
		if(v === false) { 
			console.log('parser: [sentence] failed to find direct object');
		}
		//console.log(iobj, dobj);
		
		if(iobj && !dobj) {
			dobj = iobj;
			iobj = null;
		} 
		
		// add any phrasal verb prepositions to the direct object, implied or otherwise
		if(verb_preps.length) {
			if(!dobj) {
				dobj = {
					type: 'pronoun',
					pro: '-implied-',
					preps: [],
				}
			}
			
			dobj.preps = dobj.preps.concat(verb_preps);
		}
		
		return {
			type: 'sentence',
			subject: s,
			verb: v,
			iobj: iobj,
			dobj: dobj,
		};
	}
	
	function parseSubject(list) { 
		return parseNounPhrase(list);
	}
	
	function parseSentVerb(list) {
		return parseVerbPhrase(list);
	}
	
	function parseNounPhrase(list) {
		if(!list || list.length == 0) { return false; }
		
		// optional article
		var ar = parseArticle(list);
		var l = (ar && ar.remain) || list;
		
		//console.log(l)
		
		// BUG: ambiguous or compound nouns starting with an adjective: "Green Lantern"
		// many optional adjectives
		var adjs = [];
		do {
			var a = parseAdjective(l);
			if(a) {
				l = a.remain;
				adjs.push(a);
			}
		} while(a);
		
		//console.log(l)
		
		var n = parseNoun(l);
		if(n == false) {
			return false;
		}
		
		//console.log(n)
		
		// TODO: prepositions
		var preps = [];
		l = n.remain;
		do {
			var a = parsePrepPhrase(l);
			if(a) {
				l = a.remain;
				preps.push(a);
			}
		} while(a);
		
		return {
			type: 'noun_phrase',
			noun: n,
			adjectives: adjs,
			article: ar,
			preps: preps,
			
			remain: n.remain,
		}
	}
	
	function parseArticle(list) {
		if(!isArticle(list[0])) return false;
		
		return {
			type: 'article',
			article: list[0],
			
			remain: list.slice(1),
		}
	}
	
	function parseAdjective(list) {
		// TODO: implement
		return false;
	}
	
	function parseNoun(list) {
		if(!list || list.length == 0) return false;
		
		var sn = list[0];
		
		var word;
		if(lex.start_word[sn]) {
			//console.log('found startword');
			
			for(var i = 0; i < lex.start_word[sn].length; i++) {
				var w = lex.start_word[sn][i];
				
				if(w.pos != 'noun') continue;
				
				function compareList(sent, sn, comp) {
					var len = Math.min(comp.length, sent.length - sn);
					for(var i = 0; i < len; i++) {
						if(sent[sn + i] != comp[i]) return false;
					}
					return i < comp.length - 1 ? false : true;
				}
				
				var x = compareList(list, 1, w.follows);
				if(x) {
					word = w;
					break;
				}
				
			}
			
		}
		
		if(word) {
			return {
				type: 'noun',
				noun: word.full,
				
				remain: list.slice(1 + word.follows.length),
			}
		}
		else {
			return {
				type: 'noun',
				noun: list[0],
				
				remain: list.slice(1),
			}
		}
	}
	
	
	function parsePrepPhrase(list) {
		if(!isPreposition(list[0])) return false;
		
		var l = list.slice(1);
		var np = parseNounPhrase(l);
		var l2;
		if(!np) {
			console.log('parser: broken prepositional phrase')
			l2 = l;
		}
		else l2 = np.remain;
		
		return {
			type: 'prep_phrase',
			prep: {
				type: 'prep',
				prep: list[0],
				remain: l,
			},
			obj: np,
			
			remain: l2,
		};
	}
	
	
	function parseVerbPhrase(list) {
		var advs = [];
		var l = list;
		do {
			var a = parseAdverb(l);
			if(a) {
				l = a.remain;
				advs.push(a);
			}
		} while(a);
		
		var v = parseVerb(l);
		if(!v) return false;
		
		return {
			type: 'verb_phrase',
			verb: v,
			adverbs: advs,
			
			remain: v.remain,
		};
	}
	
	
	function parseAdverb(list) {
		// TODO: implement
		return false;
	}
	
	function parseVerb(list) {
		if(!list || list.length == 0) return false;
		
		return {
			type: 'verb',
			verb: list[0],
			
			remain: list.slice(1),
		};
	}
	
	
	
	function parseIndirectObject(list) {
		return parseNounPhrase(list);
	}
	function parseDirectObject(list) {
		return parseNounPhrase(list)
	}
	
	
	
	//	var stemmed_list = raw_list.map(stemmer);
	
	
	
	function seqNorm(x) {
		if(typeof x == 'Object') return x;
		return {what: x};
	}
	
	
	function actionFromVerb(word) {
		return lex.verbs[word];
	}
		
	
	
	
	function wordSplit(text) {
		// minimize whitespace first
		return text.replace(/\s+/g, ' ').split(' ');
	}
	
	function wsMinTrim(text) {
		return text.replace(/\s+/g, ' ').replace(/\s*$/, '').replace(/^\s*/, '');
	}
	
	// remove special characters
	function stripper(text) {
		return text
			.replace(/[^0-9a-zA-Z\.]/g, '')
			.replace(/\.$/, '')
			.replace(/^\./, '')
	}
	
	function stemmer(raw) {
		return raw.replace(/e?'?s?'?$/, '');
	}
	
	var article_words = objectify([
		'a', 'an', 'the', 'one', 'some', 'few',
	]);
	function junkFilter(list) {
		return list.reduce(function(acc, w) {
			if(!article_words[w]) return acc.push[w];
		}, []);
	}
	
	var preposition_words = objectify([
		'aboard', 'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'anti', 'around', 'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'but', 'by', 'concerning', 'considering', 'despite', 'down', 'during', 'except', 'excepting', 'excluding', 'following', 'for', 'from', 'in', 'inside', 'into', 'like', 'minus', 'near', 'of', 'off', 'on', 'onto', 'opposite', 'outside', 'over', 'past', 'per', 'plus', 'regarding', 'round', 'save', 'since', 'than', 'through', 'to', 'toward', 'towards', 'under', 'underneath', 'unlike', 'until', 'up', 'upon', 'versus', 'via', 'with', 'within', 'without',
	]);
	function prepFilter(list) {
		return list.reduce(function(acc, w) {
			if(!preposition_words[w]) return acc.push[w];
		}, []);
	}
	
	function isPreposition(word) {
		return preposition_words[word] == true
	}
	function isArticle(word) {
	//	console.log(article_words)
		return article_words[word] == true
	}
	
	
	
	// really shitty
	function isPlural(word) {
		return /s$/.test(word);
	}
	// half decent
	function isPosessive(word) {
		return /('s|s')$/.test(word);
	}
	
	function classify(word) {
		
		
	}
	
	// misc helpers
	function objectify(arr) {
		var out = {};
		for(var i = 0; i < arr.length; i++) out[arr[i]] = true;
		return out;
	}
	
	
	
	// preprocessing 
	
	function processVerbList(input) {
		
		var out = {
			actions: {},
			verbs: {},
			pos: {},
		}
		
		for(var verb in input) {
			var action = input[verb].toLowerCase();
			var v = stemmer(wsMinTrim(verb.toLowerCase())); // TODO: handle multi-word phrases
			
			lex.actions[action] = lex.actions[action] || [];
			lex.actions[action].push(v);
			
			lex.verbs[v] = action;
			
			lex.pos[v] = 'verb';
		}
		
		return out;
	}
	
	
	function processPlayerList(input) {
		
		for(var i in input) {
			var pl = input[i];
			
			lex.players[pl.name.toLowerCase()] = pl.name;
			lex.players[pl.nick.toLowerCase()] = pl.name;
		}
	}
	
	
	function processMonsterList(input) {
		
		for(var id in input) {
			var mon = input[id];
			console.log("monster", mon.name)
			if(!mon.name) continue; // shim for incomplete definitions
			
			var l = wordSplit(mon.name.toLowerCase()).map(stripper);
			console.log('   ', l);
			// handle multi-word nouns
			if(l.length > 1) {
				lex.start_word[l[0]] = lex.start_word[l[0]] || [];
				
				
				lex.start_word[l[0]].push({
					follows: l.slice(1),
					type: 'monster',
					pos: 'noun',
					id: id,
					full: mon.name.toLowerCase(),
				})
			}
			
			lex.pos[mon.name] = 'noun';
			
		}
	}

	function processWeaponList(input) {
		
		
	}

	function processItemList(input) {
		
		
		for(var id in input) {
			var item = input[id];
			if(!item.name) continue; // shim for incomplete definitions
			
			var l = wordSplit(item.name.toLowerCase()).map(stripper);
			
			// handle multi-word nouns
			if(l.length > 1) {
				lex.start_word[l[0]] = lex.start_word[l[0]] || [];
				lex.start_word[l[0]].push({
					follows: l.slice(1),
					type: 'item',
					pos: 'noun',
					id: id,
					full: item.name.toLowerCase(),
				})
			}
			
			lex.pos[item.name] = 'noun';
			
		}
		
	}
	
	function processGame() {
		var cfg = require('./parser_config.js')
		

		processVerbList(cfg.verbs);
		processPlayerList(game.players);
		processMonsterList(game.monsters);
		processWeaponList(game.weapons);
		processItemList(game.items);
	}
	
	
	
	
	
		
	return {
	
		processGame: processGame,
		
		parse: parse,
		parseSentence: parseSentence,
		
		stemmer: stemmer,
		stripper: stripper,
		processVerbList: processVerbList,
	};
}
