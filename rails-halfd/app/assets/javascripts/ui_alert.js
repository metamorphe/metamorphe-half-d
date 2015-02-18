function UIAlert (container) {
	console.log(container);
	this.dom = UIAlert.generateDOM();
	console.log(this.dom)
	$(container).append(this.dom);
}

UIAlert.generateDOM = function(){
	var dom =  $('<div class="alert alert-info">\
  				<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>\
			  	<span id="msg"></span>\
			  </div>');
	dom.hide().css({
		position: "absolute",
		top: 10, 
		margin: "auto 20%", 
		width: "60%",
		"z-index": 100
	});
	return dom;
}
UIAlert.prototype = {
	notice: function(msg){
		this.dom.find('#msg').html(msg);
		this.show();
	},
	flash: function(msg, ms, fn){
		var self = this;
		this.dom.find('#msg').html(msg);
		this.dom.show(function(){
			fn();
			self.dom.fadeOut(ms);
		});
	},
	show: function(){
		this.dom.show();
	},
	hide: function(){
		this.dom.fadeOut();
	}
}