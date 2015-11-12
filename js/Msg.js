
var $ = require('./jquery');
require('./Msg.css');
function Msg(opts){
	this.options = opts;
	this._init();
	this._render();
}

Msg.prototype = {
	_init:function(){

		var defauts = {
			content:'',
			autoClose:true,
			timer:200
		}
		this.config = $.extend(true, defauts, this.options);
	},
	_render:function(){

		var self = this;
		self.$alert = null;
		if(!$('.ui-alter').length){
			self.$alert  = $('<div class="ui-masker"></div><div class="ui-alert"><p>' + self.config.content + ' </p></div>').appendTo('body');
		}
		if(self.config.autoClose){
			setTimeout(
				function(){
					self.$alert.remove();
				}
				, self.config.timer);
		}
	},
	close:function(){
		self.$alert.remove();
	}
}
module.exports = Msg;