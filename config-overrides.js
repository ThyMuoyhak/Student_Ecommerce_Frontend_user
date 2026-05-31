const webpack = require('webpack');

module.exports = function override(config) {
  // Fallbacks for node core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "stream": require.resolve("stream-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "https": require.resolve("https-browserify"),
    "http": require.resolve("stream-http"),
    "url": require.resolve("url"),
    "assert": require.resolve("assert"),
    "path": require.resolve("path-browserify"),
    "util": require.resolve("util"),
    "zlib": require.resolve("browserify-zlib"),
    "net": false,
    "tls": false,
    "http2": false,
    "fs": false,
    "dns": false,
    "child_process": false
  };
  
  // Add plugins
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ];
  
  // Ignore warnings
  config.ignoreWarnings = [/Failed to parse source map/];
  
  return config;
};