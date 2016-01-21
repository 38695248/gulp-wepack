var webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),//有时候可能希望项目的样式能不要被打包到脚本中，而是独立出来作为.css，然后在页面中以<link>标签引入
    minifyPlugin=new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    _config = require('./config.json');
    //commonsPlugin = new webpack.optimize.CommonsChunkPlugin('comm.min.js');//它用于提取多个入口文件的公共脚本部分，然后生成一个 common.js 来方便多页面之间进行复用
module.exports = {
    plugins: [//插件项
        //minifyPlugin //压缩 JavaScript
    ], //页面入口文件配置
    entry: {
        index : _config.src+'/js/index',//首页
        custom : _config.src+'/js/custom',//定制
        comm: [_config.src+'/js/libs/jquery-1.8.3.min'] //第三方库
    }, //入口文件输出配置
    output: {
        path: _config.src+'/jsmin',
        filename: '[name].js',
        chunkFilename:"/chunk/[id].chunk.js",//动态生成文件的路径
        publicPath:"http://localhost:63342/byshare/"+_config.dir+"/js/" //html引用路径，在这里是本地地址。
    },//是对应输出项配置（即入口文件最终要生成什么名字的文件、存放到哪里）
    module: { //加载器配置
        loaders: [//是最关键的一块配置。它告知 webpack 每一种文件都需要使用什么加载器来处理
             //{ test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
             //{ test: /\.js$/, loader: 'babel-loader',exclude: /node_modules/},
             //{ test: /\.css$/, loader: "style!css" },
             //{test: /\.less/,loader: 'style-loader!css-loader!less-loader'}
        ]
    },//其它解决方案配置
    resolve: {//查找module的话从这里开始查找
        root: _config.src+'/', //绝对路径
        extensions: ['', '.js', '.json', '.scss'],//自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        alias: {//模块别名定义，方便后续直接引用别名，无须多写长长的地址
            config : 'js/comm/config',
            base : 'js/comm/base',
            ajax:'js/comm/ajax',
            custom:'js/modules/custom'
        }
    }
};