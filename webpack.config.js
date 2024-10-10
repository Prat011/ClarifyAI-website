const webpack = require('webpack');

module.exports = {
    resolve: {
        fallback: {
            "path": require.resolve("path-browserify"),
            // Add other Node.js core modules here if needed
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        })
    ]
};