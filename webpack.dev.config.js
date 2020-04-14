var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    entry: './src/index.ts',
    mode: "development",
    output: {
        path: __dirname + '/dist',
        filename: 'main.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.ejs'
        })
    ],
    devServer: {
        contentBase: __dirname,
        proxy: {
            '/api': "http://127.0.0.1:8000"
        } 
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.scss']
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    'raw-loader',
                    'sass-loader'
                ]
            },
            { 
                test: /\.tsx?$/, 
                loader: "awesome-typescript-loader" 
            }
        ],
    }
};