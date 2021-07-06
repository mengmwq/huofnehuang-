var webpack = require('webpack')
var path = require('path')
var utils = require('./utils')
var config = require('../config/index')
var vueLoaderConfig = require('./vue-loader.conf')
var proxy = require('http-proxy-middleware')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {

    entry: {

        app: [
            'webpack-dev-server/client?http://localhost:8888',
            'webpack/hot/only-dev-server',
            './src/main/vuejs/main.js'
        ],
        vendor: ['vue', 'vuex', 'vue-router', 'jquery', 'element-ui', 'crypto-js']
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: 'http://localhost:8888/dist/',
        // publicPath: "/dist/",
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash:5].chunk.js'
        //    publicPath: process.env.NODE_ENV === 'production'
        //      ? config.build.assetsPublicPath
        //      : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('../vuejs'),
            'scss_vars': '@/styles/vars.scss',
            'vendor': '@/vendor',
        }
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
            loader: 'style-loader!css-loader'
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
    },
    externals: {
      'AMap': 'AMap',
    },
    devServer: {
        host:'localhost',
        hot: true,
        inline: true,
        open: true,
        port: 8888,
        contentBase: './src/main/resources/dev',
        index: 'home-dev',
        proxy: {
             // 登录页面的请求代理
            '/manager/proxy': {
                 // target:'http://localhost:9000',
          	target:'http://47.103.132.101:9000',
                // target:'http://hfhadmin.o0s0.cn',
                // target: 'http://94.191.49.126/hfh/',
                // target: 'http://94.191.49.126:10000',
                // target: 'http://channingwu.com:9000',
                // target: 'http://1d037543.ngrok.io',
                // target: 'http://channingwu.com:9000',
                // target: 'http://192.168.3.26:9000/',
                // target: 'http://192.168.1.9:9000/',
                // target: 'http://wanyan.frpgz1.idcfengye.com ',
                pathRewrite: {
                    '^/manager/proxy': ''
                },
                changeOrigin: true
            },
            // 登录成功之后的请求代理
            '/proxy': {
              // target:'http://localhost:9000',
          	target:'http://47.103.132.101:9000',
              // target:'http://hfhadmin.o0s0.cn',
              // target: 'http://94.191.49.126/hfh/',
              // target: 'http://94.191.49.126:10000',
              // target: 'http://channingwu.com:9000',
              // target: 'http://1d037543.ngrok.io',
              // target: 'http://channingwu.com:9000',
              // target: 'http://192.168.3.26:9000/',
              // target: 'http://192.168.1.9:9000/',
              // target: 'http://wanyan.frpgz1.idcfengye.com ',
              // target: 'http://suetest.frpgz1.idcfengye.com',
              // target: 'http://zhy.frpgz1.idcfengye.com',
              pathRewrite: {
                '^/proxy': ''
              },
              changeOrigin: true
            },
            '/router': {
                target: 'http://localhost:8888/html/home-dev.html',
                pathRewrite: {
                    '/router/.*': ''
                }
            },
            '/home': {
                target: 'http://localhost:8888/html/index.html',
                pathRewrite: {
                    '/home': ''
                }
            },
            '/index': {
                target: 'http://localhost:8888/html/login.html',
                pathRewrite: {
                    '/index': ''
                }
            },

            '/forgetPwd': {
                target: 'http://localhost:8888/html/forgetPwd.html',
                pathRewrite: {
                '/forgetPwd': ''
                }
            },

        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js'
        }),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        })
    ]
}
