'use strict';
// module.exports = {
//   entry: "./js",
//   output: {
//     path: __dirname + "/dist",
//     filename: "index.js"
//   }
// };



/*

module.exports={
	entry:{
		index:"./js/index.js",
		comment:"./js/comment.js",
		pingjia:"./js/pingjia.js"
	},
	output:{
		path:__dirname + "/dist",
		filename:"[name].js"
	}
}

*/

var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports={
	entry:{
		index:"./js/index.js",
		//zepto:".js/zepto.js",
		//Msg:"./js/Msg.js"
		//,comment:"./js/comment.js"
	},
	output:{
		path:__dirname + '/dist',
		filename:"[name].js"
	},
	module:{
		loaders:[
		//{test:/\.css$/, loader:"style!CSS"},
		 { test: /\.css$/, loader: "style-loader!css-loader" },
		// { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") }
		]
	},
	plugins: [
        new ExtractTextPlugin("[name].css")
    ]
}
