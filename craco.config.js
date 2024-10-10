// craco.config.js
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Polyfills
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "path": false,
        fs: false,
        net: false,
        tls: false,
        buffer: require.resolve('buffer'),
    };

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );

      return webpackConfig;
    },
  },
};