var webpack = require('webpack');
var path = require('path')
var utils = require('./utils')
var config = require('../config/index')
var vueLoaderConfig = require('./vue-loader.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
//var CleanWebpackPlugin = require('clean-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: ['./src/main/vuejs/main.js'],
        vendor: ['vue', 'vuex', 'vue-router', 'jquery', 'element-ui', 'crypto-js']
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: "/dist/",
        filename: '[name].[chunkhash:8].js'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': require('../config/prod.env')
      }),
        new ExtractTextPlugin('[name].[chunkhash:8].css'),
        new OptimizeCssAssetsPlugin({
            //assetNameRegExp: /\.optimize\.css$/g,
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.[chunkhash:8].js'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime',
        }),
      new CopyWebpackPlugin([ // 复制插件
        { from: 'src/main/resources/dev/html/', to:  '../../templates/' },
        { from: 'src/main/resources/dev/', to:  '../../static/' }
      ]),
        new HtmlWebpackPlugin({
            filename: '../../templates/home.html', //通过模板生成的文件名
            template: 'src/main/resources/templates/home-template.html', //模板路径
            favicon: './favicon.ico',
            inject: true, //是否自动在模板文件添加 自动生成的js文件链接
            minify: {
                removeComments: true //是否压缩时 去除注释
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json', '.html'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('../vuejs'),
            'scss_vars': '@/styles/vars.scss',
            'vendor': '@/vendor',
        }
    },
    externals: {
      'AMap': 'AMap',
    },
    module: {
        rules: [{
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            include: [resolve('src'), resolve('test')],
            options: {
                formatter: require('eslint-friendly-formatter')
            }
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueLoaderConfig
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: 'css-loader'
            })
        }, {
            test: /\.scss$/,
            loaders: ['style-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [resolve('src'), resolve('test')]
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
        }, {
            test: /\.svg$/,
            loader: 'url-loader?mimetype=image/svg+xml&limit=5000'
        }, {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    }
}
