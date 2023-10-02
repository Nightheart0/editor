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
		editor: './src/index.ts',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},

	module: {
		rules: [
			{
				resourceQuery: /raw/,
				type: 'asset/source',
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				resourceQuery: { not: [/raw/] },
				use: ['style-loader', 'css-loader'],
			},
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.mjs', '.json'],

		// Remember to tell TypeScript about the paths in `tsconfig.json`
		alias: {
			'@/': path.resolve(__dirname, 'src'),
			'@/editor': path.resolve(__dirname, 'src', 'editor'),
			'@/i18n': path.resolve(__dirname, 'src', 'i18n'),
			'@/i18n-data': path.resolve(__dirname, 'i18n'),
			'@/styles': path.resolve(__dirname, 'src', 'styles'),
			'@/utils': path.resolve(__dirname, 'src', 'utils'),
		},
	},

	devtool: 'source-map',
	devServer: {
		static: [
			{
				directory: path.join(__dirname, './assets/fonts'),
				publicPath: '/fonts',
			},
			{
				directory: path.join(__dirname, './assets/sounds'),
				publicPath: '/sounds',
			},
		],
		open: false,
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Sunstar\'s Editor Demo',
			template: './demo/index.ejs',
		}),
	],
}
