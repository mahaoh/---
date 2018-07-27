const path = require('path')
//压缩js代码插件 npm install uglifyjs-webpack-plugin
// const UglifyPlugin = require('uglifyjs-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//关联html插件 npm install html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
//css处理安装npm install extract-text-webpack-plugin@next插件
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//css压缩
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//入口文件遍历 [入口文件名]
var entry = [
    'index',
    'b'
],entryArr = {};
for(var i=0; i<entry.length; i++) entryArr[entry[i]] = './' + entry[i] + '.js';
module.exports = {
   context: path.resolve(__dirname, './static/js/'), // string
    //入口文件的目标路径
  entry: entryArr,

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].min.js',
  },
  module: {
    rules: [
    {
        test: /\.jsx?/, // 支持 js 和 jsx
        exclude: /(node_modules)/,//排除某些文件
        include: [
          path.resolve(__dirname, './static/js/'), // src 目录下的才需要经过 babel-loader 处理
        ],
        loader: 'babel-loader',
        options: {
          presets: ['es2015','react','stage-0','stage-1','stage-2','stage-3'],//编译JS
                    // 使用 stage-0 可以让 babel 支持 ES7
          plugins: ['transform-runtime'],
          cacheDirectory: true
          // 默认false;被转换的结果将会被缓存，当 Webpack 再次编译时将会首先尝试从缓存中读取转换结果，以此避免资源浪费
        }
      },
       {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]',
              outputPath: 'images/',    //输出文件路径
              publicPath: '../images/' //背景图片路径
            },
          },
        ],
      },
      {
        test: /\.less$/,
        // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
        use: ExtractTextPlugin.extract({ 
          fallback: 'style-loader',
          use: [{
            loader:'css-loader'
          },{
            loader:'postcss-loader'
          },{
            loader: 'less-loader',options:{
              //减少css解析
              paths: [
                path.resolve(__dirname, 'node_modules')
              ],
             
            }
          }
          ],
        }), 
      }
    
    ],
  },

  // 代码模块路径解析的配置
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, 'static')
    ],

    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx",'.css','.less'],
  },

  plugins: [
    new UglifyJSPlugin({
          sourceMap: true
     }),
    new ExtractTextPlugin({
    filename:  (getPath) => {
      return getPath('css/[name].min.css').replace('css/js', 'css');
    },
    allChunks: true
  }),
  //CSS压缩
  new OptimizeCssAssetsPlugin({})
  // new OptimizeCssAssetsPlugin({
  //     assetNameRegExp: /\.optimize\.css$/g,
  //     cssProcessor: require('cssnano'),
  //     cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
  //     canPrint: true
  //   })
    // 使用 uglifyjs-webpack-pldugin 来压缩 JS 代码
    // 如果你留意了我们一开始直接使用 webpack 构建的结果，你会发现默认已经使用了 JS 代码压缩的插件
    // 这其实也是我们命令中的 --mode production 的效果，后续的小节会介绍 webpack 的 mode 参数
    // new HtmlWebpackPlugin({
    //   filename: 'html/index.html', // 配置输出文件名和路径
    //   template: 'index.html', // 配置文件模板
    // }),
    //   new HtmlWebpackPlugin({
    //   filename: 'html/applyFor.html', // 配置输出文件名和路径
    //   template: 'applyFor.html', // 配置文件模板
    // }),
    
  ],
}