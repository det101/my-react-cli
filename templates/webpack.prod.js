/**
 * Created by luxiaolong on 2017/6/16.
 */

const path = require('path');
const webpack = require('webpack');
const ZipPlugin = require('zip-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');


const vendorCofig = {
    name: "vendor",
    // mode: "development || "production",
    entry: { "vender": ["antd", "react", "react-dom", "dputils"] },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[hash:8].js",
        library: "vendor_[hash]"
    },
    plugins: [
        new webpack.DllPlugin({
            name: "vendor_[hash]",
            path: path.resolve(__dirname, "dist/manifest.json")
        }),
        new UglifyJsPlugin(
            {
                uglifyOptions: {
                    ie8: false,
                    ecma: 8,
                    output: {
                        comments: false,
                        beautify: false,
                    },
                    warnings: false
                }
            }
        )
    ]
};

const appConfig = {


    entry: {
        app: './src/index.js'
    },
    dependencies: ["vendor"],
    output: {
        path: path.resolve(__dirname, 'dist'),
        //libraryTarget: "umd"
        filename: '[name].[hash:8].js',
        publicPath: '/',
        sourceMapFilename: '[name].map',
        library: 'Demo',
        libraryTarget: "umd"
    },

    //devtool: 'cheap-module-source-map',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                    // ,'eslint-loader'
                ]
            }, {
                test: /.less|css$/,
                // exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "less-loader"]
                  })
                // use: [{
                //     loader: 'style-loader' // creates style nodes from JS strings
                // }, {
                //     loader: 'css-loader' // translates CSS into CommonJS
                // }, {
                //     loader: 'less-loader',
                //     options: {
                //         strictMath: true,
                //         noIeCompat: true
                //     } // compiles Less to CSS
                // }]
                
            }, {
                test: /\.(eot|svg|ttf|woff|jpe?g|png|gif)/i,
                use: [
                    'url-loader?limit=102400'
                ]
            }
        ]
    },

    plugins: [
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, "dist/manifest.json")
        }),
        new ExtractTextPlugin({
            filename: 'style.[hash:8].css'
          }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new UglifyJsPlugin(
            {
                uglifyOptions: {
                    ie8: false,
                    ecma: 8,
                    output: {
                        comments: false,
                        beautify: false,
                    },
                    warnings: false
                }
            }
        ),
        //new ZipPlugin({
        //    // OPTIONAL: defaults to the Webpack output path (above)
        //    // can be relative (to Webpack output path) or absolute
        //    //path: 'zip',
        //
        //    // OPTIONAL: defaults to the Webpack output filename (above) or,
        //    // if not present, the basename of the path
        //    filename: 'bundle.zip',
        //
        //    // OPTIONAL: defaults to 'zip'
        //    // the file extension to use instead of 'zip'
        //    extension: 'zip',
        //
        //    // OPTIONAL: defaults an empty string
        //    // the prefix for the files included in the zip file
        //    //pathPrefix: 'relative/path',
        //
        //    // OPTIONAL: defaults to including everything
        //    // can be a string, a RegExp, or an array of strings and RegExps
        //    include: [/\.js$/],
        //
        //    // OPTIONAL: defaults to excluding nothing
        //    // can be a string, a RegExp, or an array of strings and RegExps
        //    // if a file matches both include and exclude, exclude takes precedence
        //    exclude: [/\.png$/, /\.html$/],
        //
        //    // yazl Options
        //
        //    // OPTIONAL: see https://github.com/thejoshwolfe/yazl#addfilerealpath-metadatapath-options
        //    fileOptions: {
        //        mtime: new Date(),
        //        mode: 0o100664,
        //        compress: true,
        //        forceZip64Format: false,
        //    },
        //
        //    // OPTIONAL: see https://github.com/thejoshwolfe/yazl#endoptions-finalsizecallback
        //    zipOptions: {
        //        forceZip64Format: false,
        //    },
        //}),
        // new CompressionWebpackPlugin({ //gzip 压缩
        //     asset: '[path].gz[query]',
        //     algorithm: 'gzip',
        //     test: /\.(js|css)$/,    //压缩 js 与 css,
        //     threshold: 10240,
        //     minRatio: 0.8
        // }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]

};

module.exports = [vendorCofig, appConfig];