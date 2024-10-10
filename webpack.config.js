// next.config.js
const webpack = require('webpack');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        path: require.resolve('path-browserify'),
      };
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })
    );

    return config;
  },
};