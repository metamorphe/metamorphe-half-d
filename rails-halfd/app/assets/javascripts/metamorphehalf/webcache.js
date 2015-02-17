function WebStorage(){
	this.init();
	this.store;
}
WebStorage.prototype = {
	init: function(){
		if(typeof(Storage) !== "undefined")
			this.store = sessionStorage;
		else
			console.log("Sorry, no web storage supported :(. ")
	},
	check_valid: function(){
		return this.store ? true: false;
	},
	cache: function(k, store_routine, parse_routine){
		if(storage.includes(k)){
			console.log("In storage: ", k);
			return parse_routine(JSON.parse(storage.get(k)));
		}
		else{
			console.log("Not in storage: ", k);
			var v = store_routine();
			storage.set(k, JSON.stringify(v));
			return v;
		}
	}, 	
	includes: function(k){
		if(!this.check_valid) return;
		return this.get(k);
	},
	set: function(k, v){
		if(typeof k === "undefined") return; // don't store undefined
		if(!this.check_valid) return;
		this.store.setItem(k, v)
	}, 
	get: function(k){
		if(!this.check_valid) return;
		return this.store.getItem(k)
	}, 
	remove: function(k){
		if(!this.check_valid) return;
		this.store.removeItem(k);
	}, 
	clear: function(k){
		if(!check_valid) return;
		console.log("Clearing sessionStorage.")
		for(var i in this.store)
			this.removeItem(i);
	}
}