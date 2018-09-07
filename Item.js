

function Item(name, qty, level) {
	
	if(typeof name == 'Object') {
		this.name = name.name;
		this.qty = name.qty || 1;
		this.level = name.level || 1;
	}
	else {
		this.name = name;
		this.qty = qty || 1;
		this.level = level || 1;
	}
	
	return this;
}

module.export = Item;




Item.prototype.clone = function() {
	return new Item(this);
}









 
