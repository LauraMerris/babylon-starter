const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        filename: './src/index.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ 
            title: 'App file',
        }),
    ]
}