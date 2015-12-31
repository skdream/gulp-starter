var Msg = require('./Msg.js');

/*
new Msg({
	autoClose:false,
	content:'hello,world!!!eeeekkkuuuyyy777'
});

*/

var DatePicker = require('./datepick.js');
datepicker = new DatePicker({
	trigger:document.querySelector('.time-input')
});
