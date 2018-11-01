var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'index.js',
		libraryTarget: 'commonjs2'
	},
	target: 'node',
	node: {
		fs: 'empty',
		process: false
	},
	plugins:[
		new webpack.SourceMapDevToolPlugin({
			filename: '[name].js.map'
		})
	],
	resolve: {
		alias: {
			'node-fetch$': 'node-fetch/lib/index.js'
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /(node_modules|bower_components|build)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			}
		]
	}
};