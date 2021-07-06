var utils = require('./utils')
var webpack = require('webpack')
var config = require('../../config/index')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
//var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  externals: {
    'AMap': 'AMap',
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
     // split xlsx into its own file
    new webpack.optimize.CommonsChunkPlugin({
      async: 'xlsx',
      minChunks(module) {
        var context = module.context;
        return context && (context.indexOf('xlsx') >= 0);
      }
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
//    new HtmlWebpackPlugin({
//      filename: 'index.html',
//      template: 'index.html',
//      inject: true
//    }),
    new FriendlyErrorsPlugin()
  ]
})
