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