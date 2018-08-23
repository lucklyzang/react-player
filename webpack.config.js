const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const isDev = process.env.NODE_ENV === 'development'
module.exports = {
    entry :path.resolve(__dirname,'./app/index.js'),
    devtool: 'inline-source-map',
    output: {
        path:path.resolve(__dirname,'/dist'),
        filename: 'bundle.js'
    },
    module: {
        rules:[
            {
                test: /\.js[x]?$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname,'./node_modules/')
                
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader','postcss-loader']
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader'
                    },
                ]
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name]-aaa.[ext]'
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        port: 2010,
        host: '0.0.0.0',
        overlay: {
            errors: true,
        },
        hot: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env' : {
                NODE_ENV : isDev ? '"development"' : '"production"'
            }
        }),
        new HtmlWebpackPlugin({
            template:'index.tpl.html',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]
}