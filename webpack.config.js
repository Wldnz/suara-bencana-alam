const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

// perlu diingat rules akan mengexecute dari bawah ke atas.

module.exports = (env) => {
    console.log(`Mode : ${env.production? "production" : "development"}`);
    return {
        mode : env.production? "production" : "development",
        entry : "./src/index.js",
        module : {
            rules : [
                {
                    test : /\.css$/i,
                    use :[
                        {loader : 'style-loader'},
                        {loader : 'css-loader'},
                        {loader : 'postcss-loader'},
                    ]
                },
                {
                    test : /\.js$/,
                    exclude : /node_modules/,
                    use : [
                        {
                            loader : "babel-loader",
                            options : {
                                presets : ["@babel/preset-env"]
                            }
                        }
                    ]
                },{
                    test : /\.(png|svg|jpg|jpeg|gif)$/i,
                    type : 'assets/resources'
                }
            ]
        },
        plugins : [
            // dashboard user
            new HtmlWebpackPlugin(
                {
                    template : "./src/index.html",
                    filename : "index.html"
                }
            ),
            // halaman user harus di atas page admin ya. biar enak di debugging
            //dashboard admin
            new HtmlWebpackPlugin(
                {
                    template : "./src/admin/index.html",
                    filename : "admin/index.html"
                }
            ),
            // tambahakan lagi beberapa page admin disini ya.
            new CopyPlugin({
                patterns : [
                    {from : "./public/image", to : "image"}
                ]
            })
        ],
        output : {
            filename : "bundle.js",
            path : path.resolve(__dirname,'src/dist'),
            clean : true
        },
    }
}