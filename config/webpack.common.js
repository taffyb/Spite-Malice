var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var path=require('path');

module.exports = {
	entry : {
		'polyfills' : './src/polyfills.ts',
		'vendor' : './src/vendor.ts',
		'app' : './src/main.ts'
	},

	resolve : {
		extensions : [ '.ts', '.js' ]
	},

	module : {
		rules : [ {
			test : /\.ts$/,
			loaders : [ {
				loader : 'awesome-typescript-loader',
				options : {
					configFileName : helpers.root('src', 'tsconfig.json')
				}
			}, 'angular2-template-loader' ]
		}, {
			test : /\.html$/,
			loader : 'html-loader'
		}, {
			test : /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
			loader : 'file-loader?name=assets/[name].[hash].[ext]'
		},
	      {
	        test: /\.css$/i,
	        use: ['style-loader', 'css-loader'],
	      }
		]
	},
	optimization:{splitChunks: {
		chunks: "async",
		minSize: 30000,
		minChunks: 1,
		maxAsyncRequests: 5,
		maxInitialRequests: 3,
		name: true,
		cacheGroups: {
			default: {
				minChunks: 2,
				priority: -20,
				reuseExistingChunk: true,
			},
			vendors: {
				test: /[\\/]node_modules[\\/]/,
				priority: -10
			}
		}
	}},
	plugins : [

	new webpack.ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)fesm5/, path.join(__dirname, './src')),

	new HtmlWebpackPlugin({
		template : 'src/index.html'
	}) ]
	
};