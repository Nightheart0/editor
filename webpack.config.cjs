const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

function getMode() {
	const envMode = process.env.MODE;

	switch (envMode) {
		case 'development':
			return 'development';
		case 'dev':
			return 'development';
		case 'production':
			return 'production';
		case 'prod':
			return 'production';
		default:
			console.log('Using the default mode "development"');
			return 'development';
	}
}

module.exports = {
	mode: getMode(),
	entry: {
		editor: './src/bundle-main.ts',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.mjs', '.json'],

		// Remember to tell TypeScript about the paths in `tsconfig.json`
		alias: {
			'@i18n': path.resolve(__dirname, 'i18n'),
		},
	},

	devtool: 'inline-source-map',
	devServer: {
		static: './dist',
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Misty Editor Demo',
			template: './demo/index.ejs',
		}),
	],
}
