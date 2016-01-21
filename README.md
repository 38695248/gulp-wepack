# gulp-wepack
使用gulp和webpack对项目进行构建的时候遇到了一些问题，最终算是搭建了一套比较完整的解决方案，接下来这篇文章以一个实际项目为例子，讲解多页面项目中如何利用gulp和webpack进行工程化构建。本文是自己的实践经验，所以有些解决方案并不是最优的，仍在探索优化中。所以有什么错误疏漏请随时指出。

# 现在为什么又整了一个webpack进来呢？

我们知道webpack近来都比较火，那他火的原因是什么，有什么特别屌的功能吗？带着这些疑问，继续看下去。

在使用gulp进行项目构建的时候，我们一开始的策略是将所有js打包为一个文件，所有css打包为一个文件。然后每个页面都将只加载一个js 和一个css,也就是我们通常所说的 ==all in one== 打包模式。这样做的目的就是减少http请求。这个方案对于简单的前端项目来说的是一个万金油。因为通常页面依赖的js,css并不会太大，通过压缩和 gzip等方法更加减小了文件的体积。在项目最开始的一段时间内（几个月甚至更长），一个前端团队都能通过这种办法达到以不变应万变的效果。

然而，作为一个有追求（爱折腾）的前端，难道就满足于此吗？

妈妈说我不仅要请求合并，还要按需加载，我要模块化开发，还要自动监听文件更新，支持图片自动合并....

等等！你真的需要这些功能吗？是项目真的遇到了性能问题？不然你整这些干嘛？

对于pc端应用来说，性能往往不是最突出的问题，因为pc端的网速，浏览器性能都有比较好，所以很长一段时间我们要考虑的是开发效率的问题而不是性能问题，得在前端框架的选型上下功夫。至于加载文件的大小或文件个数，都难以形成性能瓶颈。

对于wap端来说，限制于手机的慢网速（仍然有很多用不上4g，wifi的人），对网站的性能要求就比较苛刻了，这时候就不仅仅要考虑开发效率的问题了。（移动网络的性能问题可参考《web性能权威指南》）

在《高性能网站建设进阶指南》中也讲到：不要过早地考虑网站的性能问题。

这点我有不一样的看法。如果我们在项目搭建的时候就能考虑得多一点，把基本能做的先做了。所花的成本绝对比以后去重构代码的成本要低很多，而且我们能够同时保证开发效率和网站性能，何乐而不为呢。

#webpack的使用

webpack可以说是一个大而全的前端构建工具。它实现了模块化开发和静态文件处理两大问题。

以往我们要在项目中支持模块化开发，需要引入requirejs，seajs等模块加载框架。而webpack天生支持 AMD，CommonJS, ES6 module等模块规范。不用思考加载器的选型，可以直接像写nodejs一样写模块。而webpack这种万物皆模块的思想好像就是为React而生的，在React组件中可以直接引入css或图片，而做到这一切只需要一个require语句和loader的配置。

webpack的功能之多和繁杂的配置项会让初学者感到眼花缭乱，网上的很多资料也是只介绍功能不教人实用技巧。这里有一篇文章就讲解了 webpack开发的workflow , 虽然该教程是基于React的，但是比较完整地讲了webpack的开发流程。下面我也用一个实例讲解使用中遇到的问题和解决方案。

我们的项目是一个多页面项目，即每个页面为一个html，访问不同的页面需要跳转链接。项目目录结构大概是这样的，app放html文件，css为样式文件，images存放图片，js下有不同的文件夹，里面的子文件夹为一些核心文件和一些库文件，ui组件。js的根目录为页面入口文件。

#配置文件如下：

var gulp = require('gulp'),
    webpack = require('webpack'),
    gutil = require("gulp-util"),
    concat = require('gulp-concat'),//文件合并
    rev = require('gulp-rev'),
    md5 = require('gulp-md5-plus'),
    revCollector = require('gulp-rev-collector'),//- 路径替换
    clean = require('gulp-clean'),//清空里面曾经的资源，防止有冗余
    cssmin = require('gulp-minify-css'),//CSS压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    spritesmith = require('gulp.spritesmith'),//ico图片合并
    webserver  = require('gulp-webserver'),//本地Web 服务器功能（gulp-webserver + tiny-lr）
    opn        = require('opn'),//浏览器自动打开项目
    config = require('./config.json');
//清除无用JS
gulp.task('clean',function(){
    var steam = gulp.src(config.dir+'/js/*')
        .pipe(clean())
    return steam;
})
//js依赖合并
gulp.task("webpack",['clean'], function(callback) { // run webpack
     var stream = webpack(require('./webpack.config.js'),
         function(err, stats) {
             if(err) {
                 throw new gutil.PluginError("webpack", err);
             }
             gutil.log(
                 "[webpack]",
                 stats.toString({ })// output options
             );
             callback();
        }
     );
    return stream;
});
//js_dev依赖合并
gulp.task("webpack_dev", function(callback) { // run webpack
    var stream = webpack(require('./webpack.config.js'),
        function(err, stats) {
            if(err) {
                throw new gutil.PluginError("webpack", err);
            }
            gutil.log(
                "[webpack]",
                stats.toString({ })// output options
            );
            callback();
        }
    );
    return stream;
});
//加版本号js
gulp.task('rev_js',['webpack'],function(){
    var stream = gulp.src(config.src+'/jsmin/*.js')
        .pipe(rev())//- 文件名加MD5后缀
        .pipe(gulp.dest(config.dir+'/js/'))
        .pipe(rev.manifest())  //- 生成一个rev-manifest.json
        .pipe(gulp.dest(config.src+'/rev/js'))//- 将 rev-manifest.json 保存到 rev 目录内
    var copy = gulp.src(config.src+'/jsmin/chunk/*.js')
        .pipe(gulp.dest(config.dir+'/js/chunk/'))
    return stream,copy;
})
//改变js路径引用
gulp.task('replace_js',['rev_js'],function(){
    gulp.src([config.src+'/rev/js/*.json', config.src+'/views/tpl/*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector({replaceReved:true}))   //- 执行文件内js名的替换
        .pipe(gulp.dest(config.dir+'/views/tpl'));       //- 替换后的文件输出的目录
})

//图片合拼
gulp.task('spritesmith',function(){
    var num = 2;
    var spriteData = gulp.src(config.src+'/images/ico/*.png')
        .pipe(spritesmith({
            imgName: 'ico_sprite.png',
            cssName: 'ico.css',
            padding: 5,// Exaggerated for visibility, normal usage is 1 or 2
            algorithm:'binary-tree',//有top-down （从上至下）, left-right（从左至右）, diagonal（从左上至右下）, alt-diagonal （从左下至右上）和 binary-tree（二叉树排列） 五种供选择，默认 binary-tree
            cssTemplate: function (data) {
                var arr=[];
                //console.log(data.spritesheet.width)
                arr.push(".ico"+
                    "{"+
                    "background-image: url(../images/"+data.spritesheet.image+");"+
                    "background-size: "+(data.spritesheet.width)/num+"px auto"+
                    "}\n"
                );
                data.sprites.forEach(function (sprite) {
                    arr.push("."+sprite.name+
                        "{" +
                            // "background-image: url("+sprite.escaped_image+");"+
                        "background-position: "+(sprite.offset_x)/num+"px "+(sprite.offset_y)/num+"px;"+
                        "width:"+(sprite.width)/num+"px;"+
                        "height:"+(sprite.height)/num+"px;"+
                        "}\n");
                });
                return arr.join("");
            }
        }));
    spriteData.css.pipe(gulp.dest(config.src+'/css/'))
    spriteData.img.pipe(gulp.dest(config.src+'/images/'))
    return spriteData;
});
//图片压缩
gulp.task("imgmin",function(){
    var stream = gulp.src(config.src+'/images/*.{png,jpg,gif}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        //.pipe(imagemin())
        .pipe(gulp.dest(config.src+'/imagesmin'))
    return stream;
})
//图片加版本号
gulp.task('rev_img',['imgmin'],function(cb){
    var stream = gulp.src(config.src+'/imagesmin/*.{png,jpg,gif}')
        .pipe(rev())//- 文件名加MD5后缀
        .pipe(gulp.dest(config.dir+'/images/'))
        .pipe(rev.manifest())  //- 生成一个rev-manifest.json
        .pipe(gulp.dest(config.src+'/rev/img'))//- 将 rev-manifest.json 保存到 rev 目录内
    return stream;
})
//改变图片路径引用
gulp.task('replace_img',['rev_img'],function(){
    var stream = gulp.src([config.src+'/rev/img/*.json', config.src+'/css/*.css'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector({replaceReved:true}))   //- 执行文件内css名的替换
        .pipe(gulp.dest(config.src+'/cssrev/'));       //- 替换后的文件输出的目录
    return stream;
})

// 编译、合并、压缩，
gulp.task('css',['replace_img'],function(cb){
    var stream = gulp.src(config.src+'/cssrev/*.css')
        .pipe(concat('byshare.min.css'))
       // .pipe(rename({suffix:'.min'}))
        .pipe(cssmin())
        .pipe(gulp.dest(config.src+'/cssmin'))
    return stream;
})

//加版本号css
gulp.task('rev_css',['css'],function(){
    var stream = gulp.src(config.src+'/cssmin/*.css')
        .pipe(rev())//- 文件名加MD5后缀
        .pipe(gulp.dest(config.dir+'/css'))
        .pipe(rev.manifest())  //- 生成一个rev-manifest.json
        .pipe(gulp.dest(config.src+'/rev/css'))//- 将 rev-manifest.json 保存到 rev 目录内
    return stream;
})
//改变css路径引用
gulp.task('replace_css',['rev_css'],function(){
    gulp.src([config.src+'/rev/css/*.json', config.src+'/views/tpl/heard.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector({replaceReved:true}))   //- 执行文件内css名的替换
        .pipe(gulp.dest(config.dir+'/views/tpl'));       //- 替换后的文件输出的目录
})

//开启本地 Web 服务器功能
gulp.task('webserver',['replace_css'], function() {
    var stream = gulp.src(config.dir )
        .pipe(webserver({
            host:             config.localserver.host,
            port:             config.localserver.port,
            livereload:       true,//自动刷新（livereload）功能而添加
            directoryListing: false//目录列表
        }));
    return stream;
});
//通过浏览器打开本地 Web服务器 路径
gulp.task('openbrowser',['webserver'],function() {
    opn( 'http://' + config.localserver.host + ':' + config.localserver.port );
});
//开发模式
gulp.task('dev_js',function(){
    gulp.watch(config.src+'/js/**/*.js', ['webpack_dev']);
    //gulp.watch(paths.images, ['images']);
});
//合并图片
gulp.task("img_hebing",['spritesmith']);
//项目完成提交任务
gulp.task('build',['replace_css','replace_js']);

gulp.task("default",['build']);

# 支持雪碧图合并
1.我是用 gulp.spritesmith 来合拼图片
2.合并配置
var spritesmith = require('gulp.spritesmith'),//ico图片合并
//图片合拼
gulp.task('spritesmith',function(){
    var num = 2;
    var spriteData = gulp.src(config.src+'/images/ico/*.png')
        .pipe(spritesmith({
            imgName: 'ico_sprite.png',
            cssName: 'ico.css',
            padding: 5,// Exaggerated for visibility, normal usage is 1 or 2
            algorithm:'binary-tree',//有top-down （从上至下）, left-right（从左至右）, diagonal（从左上至右下）, alt-diagonal （从左下至右上）和 binary-tree（二叉树排列） 五种供选择，默认 binary-tree
            cssTemplate: function (data) {
                var arr=[];
                //console.log(data.spritesheet.width)
                arr.push(".ico"+
                    "{"+
                    "background-image: url(../images/"+data.spritesheet.image+");"+
                    "background-size: "+(data.spritesheet.width)/num+"px auto"+
                    "}\n"
                );
                data.sprites.forEach(function (sprite) {
                    arr.push("."+sprite.name+
                        "{" +
                            // "background-image: url("+sprite.escaped_image+");"+
                        "background-position: "+(sprite.offset_x)/num+"px "+(sprite.offset_y)/num+"px;"+
                        "width:"+(sprite.width)/num+"px;"+
                        "height:"+(sprite.height)/num+"px;"+
                        "}\n");
                });
                return arr.join("");
            }
        }));
    spriteData.css.pipe(gulp.dest(config.src+'/css/'))
    spriteData.img.pipe(gulp.dest(config.src+'/images/'))
    return spriteData;
});

