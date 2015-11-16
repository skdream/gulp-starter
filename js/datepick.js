var $ = require('./jquery');


/**   
 * Parse Date value from String   
 * @param format the pattern of date   
 */   
String.prototype.toDate = function(format){
	if(null == format) format="yyyy-MM-dd";
	var pattern = format.replace("yyyy", "(\\~1{4})").replace("yy", "(\\~1{2})")
		.replace("MM", "(\\~1{2})").replace("M", "(\\~1{1,2})")
		.replace("dd", "(\\~1{2})").replace("d", "(\\~1{1,2})").replace(/~1/g, "d");
	
	var returnDate;
	if (new RegExp(pattern).test(this)) {
	    var yPos = format.indexOf("yyyy");
	    var mPos = format.indexOf("MM");
	    var dPos = format.indexOf("dd");
	    if (mPos == -1) mPos = format.indexOf("M");
	    if (yPos == -1) yPos = format.indexOf("yy");
	    if (dPos == -1) dPos = format.indexOf("d");
	    var pos = new Array(yPos + "y", mPos + "m", dPos + "d");
	    var data = { y: 0, m: 0, d: 1};
	    var m = this.match(pattern);
	    for (var i = 1; i < m.length; i++) {
	        if (i == 0) return;
	        var flag = pos[i - 1].split('')[1];
	        data[flag] = m[i];
	        //alert(pos[i-1] + ",flag:"+flag + ",i:" + i + "," + data[flag]);
	    };
		
	    if (data.y.toString().length == 2) {
	        data.y = parseInt("20" + data.y);
	    }
	    data.m = data.m - 1;
	    returnDate = new Date(data.y, data.m, data.d);
	}
	if (returnDate == null || isNaN(returnDate)) returnDate = new Date();
	return returnDate;
 
};

/**   
 * Date Format 
 * @param style date format like 'yyyyMMdd'
 */   
Date.prototype.format = function(style) {
  var o = {   
    "M+" : this.getMonth() + 1, //month   
    "d+" : this.getDate(),      //day   
    "h+" : this.getHours(),     //hour   
    "m+" : this.getMinutes(),   //minute   
    "s+" : this.getSeconds(),   //second   
    "w+" : "日一二三四五六".charAt(this.getDay()),   //week   
    "q+" : Math.floor((this.getMonth() + 3) / 3),  //quarter   
    "S"  : this.getMilliseconds() //millisecond   
  }   
  if(/(y+)/.test(style)) {   
	style = style.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));   
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(style)){   
      style = style.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));   
    }
  } 
  return style;
};

/**
Date add by interval
@param interval y  Year,m  Month,d  Day,w  Week
@param number

*/
Date.prototype.dateAdd = function(interval, number) {
	switch (interval) {
	  case "y":
		return new Date(this.getFullYear() + number, this.getMonth(), this.getDate());
		break;
	  case "m":
		return new Date(this.getFullYear(), this.getMonth() + number, checkDate(this.getFullYear(), this.getMonth() + number, this.getDate()));
		break;
	  case "d":
		return new Date(this.getFullYear(), this.getMonth(), this.getDate() + number);
		break;
	  case "h":
		return new Date(this.getFullYear(), this.getMonth(), this.getDate() ,this.getHours()+ number);
		break;
	  case "w":
		return new Date(this.getFullYear(), this.getMonth(), 7 * number + this.getDate());
		break;
	}
}

function checkDate(year, month, date){

	var enddate = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
	var returnDate = "";
	if( is_leap(year) ){
		enddate[1] = "29";
	}
	if(date> enddate[month] ){
		returnDate = enddate[month];
	}else{
		returnDate = date;
	}
	return returnDate;
}

function is_leap(year) {
   return ( year%100==0? (year%400 == 0? 1: 0): (year%4==0? 1: 0) );
}




function Calendar(opts){

	this.beginDate = "1900-01-01".toDate();
    this.endDate = "2020-01-01".toDate();


    this.currentDate = new Date();
    var defaults = {
    	trigger:$('.time-input'),
    	moduleClick:true,
    	beginHour:"08",
    	endHour:"19"
    };
	this.config = $.extend({},defaults, opts) ;

	var opts = this.config;
    var currDate = new Date();

	if(null != currDate){
		this.date = currDate;
	}else{
		this.date = new Date();
	}
  
    if(null != opts.beginDate){
    	this.beginDate = opts.beginDate;
    }
    if(null != opts.endDate){
    	this.endDate = opts.endDate;
    }


	this.draw(this.date);
	this.bindEvent();
}

Calendar.prototype.draw = function(date){

	var self = this;

	var conf = self.config;

	//var date = this.date;

	if( $('.ui-datepick').length ){
		this.show();
		return;
	}

	var daysHtml = [];
	var timeHtml = [];

	var topHeader = ['今天','明天','后天'];

	for(var i=0;i<topHeader.length; i++){
		var nDate = date.dateAdd('d',i);
		daysHtml.push('<li data-date=' + i  + ( i==0 ? ' class="active"': '') +'><b class="alias">'+topHeader[i]+'</b><b class="date">' + nDate.format('MM月dd日') + '</b></li>');
	}

	var curHour = date.getHours();


	var beginHour = parseInt(conf.beginHour,10);
	var endHour = parseInt(conf.endHour,10);


	var start = '';


	if(curHour > beginHour){
		beginHour = curHour;
	}

	for(var j=0;j<endHour-beginHour;j++){

		// var from = j>9? j:'0'+j;
		// var to  = j+1>9?j+1:'0'+(j+1);

		var from = date.dateAdd('h',j).format('hh:00');
		var to = date.dateAdd('h',j+1).format('hh:00');

		var ymd = date.format("yyyy-MM-dd");
		var f2T = from + '-' + to;
		//console.log(hour);

		timeHtml.push('<span data-date="'+ ymd + ' ' + to +'" class="time-item">'+ f2T  +'</span>');

		 var aa = date.format("yyyy-MM-dd") + ' ' + from + '-' + to
		 console.log(aa);
	}



	// 



	var html = [' <div class="ui-masker"></div> <div class="ui-datepick"><ul class="ui-datepick-hd clearfix">',
			daysHtml.join(''),
			'</ul><div class="ui-datepick-bd"><div class="ui-datepick-content">',
	    	timeHtml.join(''),	
    		'</div>	</div> </div>'
    		];

    this.$datePaker = $(html.join('')).appendTo('body');

}

Calendar.prototype.show = function(){
	$('.ui-masker').show();
	$('.ui-datepick').show();	
}
Calendar.prototype.hide = function(){
	$('.ui-masker').hide();
	$('.ui-datepick').hide();
}



Calendar.prototype.bindEvent=function(){
	var self = this;
	var conf = this.config;
	$(conf.trigger).on('click',self.show);

	if(conf.moduleClick){
		$('.ui-masker').on('click',self.hide)
	}
};






module.exports = Calendar;