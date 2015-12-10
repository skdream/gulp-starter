
# 前端模块化工具-webpack






webpack 的优势
其优势主要可以归类为如下几个：

1.支持CommonJS、ES6、AMD、UMD等，(甚至是混合形式)方便旧项目进行代码迁移。
2.可以打包成一个完整的包，也可以分成多个部分，在运行时异步加载（可以减少初始加载时间）。
3.依赖在编译时即处理完毕，可以减少运行时包的大小。
3.Loaders可以使文件在编译时得到预处理，这可以帮我们做很多事情，比如说coffee转换成JavaScript，模板的预编译，图片的base64处理；
4. 开发便捷，能替代部分 grunt/gulp 的工作，比如打包、压缩混淆、图片转base64等。
5. 扩展性强，高度模块化插件系统可以适应多变的需求。



## 与require.js、browserify,jspm等工具的比较


https://webpack.github.io/docs/comparison.html




## Plugins

https://webpack.github.io/docs/plugins.html

## Loaders

	-- basic

		* json: Loads file as JSON
		* raw: Loads raw content of a file (as utf-8)
		* val: Executes code as module and consider exports as JavaScript code
		* script: Executes a JavaScript file once in global context (like in script tag), requires are not parsed.
	-- packaging

		* file: Emits the file into the output folder and returns the (relative) url.
		* url: The url loader works like the file loader, but can return a Data Url if the file is smaller than a limit.
		* image: Compresses your images. Ideal to use together with file or url.
		* svgo-loader: Compresses SVG images using svgo library
		* baggage: Automatically require any resources related to the required one
		* polymer-loader: Process HTML & CSS with preprocessor of choice and require() Web Components like first-class modules.

    -- dialects

		* coffee: Loads coffee-script like JavaScript
		* babel: Turn ES6 code into vanilla ES5 using Babel.
		* livescript: Loads LiveScript like JavaScript
		* sweetjs: Use sweetjs macros.
		* traceur: Use future JavaScript features with Traceur.
		* typescript: Loads TypeScript like JavaScript.

	-- templating

		* html: Exports HTML as string, require references to static resources.
		* jade: Loads jade template and returns a function
		* handlebars: Loads handlebars template and returns a function
		* ractive: Pre-compiles Ractive templates for interactive DOM manipulation
		* markdown: Compiles Markdown to HTML
		* ng-cache: Puts HTML partials in the Angular's $templateCache

	-- styling

		* style: Add exports of a module as style to DOM
		* css: Loads css file with resolved imports and returns css code
		* cssnext: Loads and compiles a css file using cssnext
		* less: Loads and compiles a less file
		* sass: Loads and compiles a scss file
		* stylus: Loads and compiles a stylus file

	-- misc

		* po: Loads a PO gettext file and returns JSON
		* mocha: Do tests with mocha in browser or node.js
		* eslint: PreLoader for linting code using ESLint.
		* jshint: PreLoader for linting code.
		* jscs: PreLoader for style checking.
		* injectable: Allow to inject dependencies into modules
		* transform: Use browserify transforms as loader.




Loaders 列表：
https://webpack.github.io/docs/loaders.html


## 安装

global:

$ npm install webpack -g

project:

$ npm install webpack --save-dev







## webpack详解

```

var webpack = require('webpack');
module.exports = {
	entry: './entry.js',
	output: {
		path: __dirname,
		filename: 'bundle.js'
	},
    module: {
        loaders: [
        { test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude:/node_modules/ },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
        { test: /\.css$/, loader: "style!css" },
        { test: /\.less/,loader: 'style-loader!css-loader!less-loader'}
        ]
    },
    resolve:{
        extensions:['','.js','.json']
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ]
};

```


```

module.exports={
	entry:{
		bundle:"./entry.js",
		feed:"./feed.js"
	},
	output:{
		path:'build',
		filename:"[name].js"
	},
	module:{
		loaders:[
		{test:/\.css$/, loader:"style!CSS"}
		]
	}
}

```





webpack.config.js文件通常放在项目的根目录中，它本身也是一个标准的Commonjs规范的模块。在导出的配置对象中有几个关键的参数：

 

1.entry

entry可以是个字符串或数组或者是对象。

当entry是个字符串的时候，用来定义入口文件：

1 entry: './js/main.js'
当entry是个数组的时候，里面同样包含入口js文件，另外一个参数可以是用来配置webpack提供的一个静态资源服务器，webpack-dev-server。webpack-dev-server会监控项目中每一个文件的变化，实时的进行构建，并且自动刷新页面:

```
entry: [
    'webpack/hot/only-dev-server',
    './js/app.js'
]

```
当entry是个对象的时候，我们可以将不同的文件构建成不同的文件，按需使用，比如在我的hello页面中只要\<script src='build/Profile.js'></script>引入hello.js即可：

```
entry: {
    hello: './js/hello.js',
    form: './js/form.js'
}

```

2.output

output参数是个对象，用于定义构建后的文件的输出。其中包含path和filename：

```
output: {
    path: './build',
    filename: 'bundle.js'
}

```
当我们在entry中定义构建多个文件时，filename可以对应的更改为[name].js用于定义不同文件构建后的名字。

 

3.module

关于模块的加载相关，我们就定义在module.loaders中。这里通过正则表达式去匹配不同后缀的文件名，然后给它们定义不同的加载器。比如说给less文件定义串联的三个加载器（！用来定义级联关系）：

```
module: {
    loaders: [
        { test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
        { test: /\.css$/, loader: "style!css" },
        { test: /\.less/, loader: 'style-loader!css-loader!less-loader'}
    ]
}
```

此外，还可以添加用来定义png、jpg这样的图片资源在小于10k时自动处理为base64图片的加载器：

```
{ test: /\.(png|jpg)$/,loader: 'url-loader?limit=10000'}
```
给css和less还有图片添加了loader之后，我们不仅可以像在node中那样require js文件了，我们还可以require css、less甚至图片文件：

```

require('./bootstrap.css');
require('./myapp.less');
var img = document.createElement('img');
img.src = require('./glyph.png');

```

但是需要知道的是，这样require来的文件会内联到 js bundle中。如果我们需要把保留require的写法又想把css文件单独拿出来，可以使用下面提到的[extract-text-webpack-plugin]插件。

在上面示例代码中配置的第一个loaders我们可以看到一个叫做react-hot的加载器。我的项目是用来学习react写相关代码的，所以配置了一个react-hot加载器，通过它，可以实现对react组件的热替换。我们已经在entry参数中配置了`webpack/hot/only-dev-server`,所以我们只要在启动webpack开发服务器时开启--hot参数，就可以使用react-hot-loader了。在package.json文件中这样定义：

```
"scripts": {
    "start": "webpack-dev-server --hot --progress --colors",
    "build": "webpack --progress --colors"
}

```

4.resolve

webpack在构建包的时候会按目录的进行文件的查找，resolve属性中的extensions数组中用于配置程序可以自行补全哪些文件后缀：

```
resolve:{
    extensions:['','.js','.json']
}
```

然后我们想要加载一个js文件时，只要require('common')就可以加载common.js文件了。


5.plugin

webpack提供了[丰富的组件]用来满足不同的需求，当然我们也可以自行实现一个组件来满足自己的需求。在我的项目里面没有特殊的需求，于是便只是配置了NoErrorsPlugin插件，用来跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误：

```
plugins: [
    new webpack.NoErrorsPlugin()
]
```

6.externals

当我们想在项目中require一些其他的类库或者API，而又不想让这些类库的源码被构建到运行时文件中，这在实际开发中很有必要。此时我们就可以通过配置externals参数来解决这个问题：
```
externals: {
    "jquery": "jQuery"
}
```
这样我们就可以放心的在项目中使用这些API了：var jQuery = require("jquery");

 

7.context

当我们在require一个模块的时候，如果在require中包含变量，像这样：

``` require("./mods/" + name + ".js");

那么在编译的时候我们是不能知道具体的模块的。但这个时候，webpack也会为我们做些分析工作：

1.分析目录：'./mods'； 
2.提取正则表达式：'/^.*\.js$/'；

于是这个时候为了更好地配合wenpack进行编译，我们可以给它指明路径，像在cake-webpack-config中所做的那样（我们在这里先忽略abcoption的作用）：

```
var currentBase = process.cwd();
var context = abcOptions.options.context ? abcOptions.options.context : 
path.isAbsolute(entryDir) ? entryDir : path.join(currentBase, entryDir);
```





运行 webpack
webpack 的执行也很简单，直接执行

$ webpack --display-error-details

即可，后面的参数“--display-error-details”是推荐加上的，方便出错时能查阅更详尽的信息（比如 webpack 寻找模块的过程），从而更好定位到问题。

其他主要的参数有：

$ webpack --config XXX.js //使用另一份配置文件（比如webpack.config2.js）来打包
$ webpack --watch //监听变动并自动打包
$ webpack -p //压缩混淆脚本，这个非常非常重要！
$ webpack -d //生成map映射文件，告知哪些模块被最终打包到哪里了
其中的 -p 是很重要的参数，曾经一个未压缩的 700kb 的文件，压缩后直接降到 180kb （主要是样式这块一句就独占一行脚本，导致未压缩脚本变得很大） 。




关于工具的定位

webpack的定位是module bundler，作为模块化工具，它的竞争对手看起来更像是[browserify]，而不是[Gulp]，基于流的自动化构建工具。




## 参考文档

 * [webpack](https://github.com/webpack/webpack#installation)
 * [webpack-howto](https://github.com/petehunt/webpack-howto)
 * [webpack compared](http://survivejs.com/webpack_react/webpack_compared/)
 * [参考手册](https://christianalfoni.github.io/react-webpack-cookbook/)

 https://github.com/chemdemo/webpack-bootstrap/blob/master/make-webpack.config.js

 https://github.com/JsAaron/vue-gulp-webpack

 https://github.com/chemdemo/webpack-bootstrap