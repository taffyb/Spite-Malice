const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode:'development',
  entry: './src/index.js',
  output: {
	filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
	rules: [
		{
		  test: /\.css$/,
		  use: [
			  'style-loader',
			  'css-loader'
		  ]
	  	}/*,
		{
			test: /\.(png|svg|jpg|gif)$/,  
            use: [{
                loader: 'url-loader',
                options: { 
                    limit: 8000, // Convert images < 8kb to base64 strings
                    name: 'images/[name].[ext]'
                } 
            }]
		}*/
	  ]
	},
	"plugins":[ 
		new CopyWebpackPlugin([
            {from:'src/images',to:'images'} ,
            {from:'src/index.html',to:'index.html'}
        ])
	  ]
};