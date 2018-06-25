const webpack = require('webpack');
const path = require('path');
//入口文件遍历 [入口文件名]
var entry = [
    'a',
    'b',
    'c'
],entryArr = {};
for(var i=0; i<entry.length; i++) entryArr[entry[i]] = './' + entry[i] + '.js';
module.exports = {
   context: path.resolve(__dirname, './src/'), // string
    //入口文件的目标路径

    entry: entryArr, // string | object | array
    //入口文件
  output: {
    // webpack 输出结果的相关选项

        path: path.resolve(__dirname, './dist/'), // string
        // 所有输出文件的目标路径 : 必须是绝对路径（使用 Node.js 的 path 模块）

        // publicPath : 'https://static.huirendai.com/static/js/v3/dist/',      // 生产
        //publicPath : 'http://static.huizhongitech.com/static/js/v3/dist/',  // 测试
        // publicPath : 'http://192.168.1.220:8082/static/js/v3/dist/',
        // 所有 chunk | CDN 按需加载或加载外部资源的目标路径：绝对路径

        filename: '[name].min.js', // string
        //「入口」的输出文件名

        chunkFilename: '[name].chunk.js' // string
        //「chunk」的输出文件名
  },
   module: {
     loaders: [
      	//加载css
       {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    "style-loader",
                    { loader: "css-loader", options: { modules: true } }
                ],
            },
      {
                // 使用指南: https://github.com/gssan/blog/issues/7
                // babel 官方默认只添加 babel-loader 还需要更多 loader 才能有效运行
                // 需要 npm : babel-core | babel-preset-es2015
                // 优化 babel 性能需要 npm : babel-plugin-transform-runtime  添加 query.plugins : ['transform-runtime']

                test: /\.jsx?$/,
                // 匹配'js' or 'jsx' 后缀的文件类型

                exclude: /(node_modules|bower_components|admin|config|core|di_test|docs|hfq_frontend|hfq_mobile|hjd_mobile|hrd_api|hrd_api_test|hrd_cron|hrd_utility|hrd_wechat|independence|hrd_www|monitor|resource|service|service_test|sh_www|sql|tools)/,
                // 排除某些文件

                loader: 'babel-loader',

                query: {
                    //参数

                    presets: ['es2015','react','stage-0','stage-1','stage-2','stage-3'],//编译JS
                    // 使用 stage-0 可以让 babel 支持 ES7

                    plugins: ['transform-runtime'],
                    // 禁用babel向每个文件注入helpe

                    cacheDirectory: true
                    // 被转换的结果将会被缓存，当 Webpack 再次编译时将会首先尝试从缓存中读取转换结果，以此避免资源浪费
                }
            }
       // //加载图片
       // {
       //   test: /\.(png|svg|jpg|gif)$/,
       //   use: [
       //     'file-loader'
       //   ]
       // },
       // //加载字体
       // {
       //   test: /\.(woff|woff2|eot|ttf|otf)$/,
       //   use: [
       //     'file-loader'
       //  ]
       // },
       // //加载文件
       // {
       //   test: /\.(csv|tsv)$/,
       //  use: [
       //     'csv-loader'
       //   ]
       // },
       // {
       //   test: /\.xml$/,
       //   use: [
       //     'xml-loader'
       //  ]
       // }
     ]
   },
       plugins:[
        //压缩代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require','jQuery']	//排除关键字
        })
    ],

};
  // module.exports = {
  //  entry: {
  //    app: './src/index.js',
  //    print: './src/print.js'
  //  },
  //   output: {
  //    filename: '[name].bundle.js',
  //     path: path.resolve(__dirname, 'dist')
  //   }
  // };