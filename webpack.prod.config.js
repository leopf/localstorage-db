module.exports = {
    entry: './src/index.ts',
    mode: "development",
    output: {
        path: __dirname + '/dist',
        filename: 'main.js'
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