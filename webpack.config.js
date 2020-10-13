const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    target: 'node',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public/js')
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            importLoaders: 2
                        },
                    }
                ]
            }
        ]
    },
    performance: {
        hints: false
    }
};