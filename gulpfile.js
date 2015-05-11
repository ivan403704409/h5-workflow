/**
 * Author: Ivan
 * create: 2015.04.20
 * update: 2015.05.11
 */
var gulp = require('gulp');
var pngquant = require('imagemin-pngquant');  //处理png
var jpegtran = require('imagemin-jpegtran');  //处理jpg
var plugins = require('gulp-load-plugins'),
  P = plugins({
    rename: {
      // 'gulp-minify-css': 'cssmin'
    }
  }); //获取插件集合

//配置参数
var path = {
  src: 'src/',
  dest: 'dist/'
};

//---------------------------开发时实时编译---------------------------------------------------
// gulp.task('sass', function() {
//     gulp.src(path.src + 'css/*.scss')     //拿到源文件
//         // .pipe(P.sass({ compass: true }))        //css排版成一行
//         .pipe(P.compass({
//             css: path.src + 'css',
//             sass: path.src + 'css', //要编译的scss所在目录
//             image: path.src + 'images/sprite/', //icon存放目录,在
//             generated_images_path: path.src + 'images/' //合并后的图片输出路径
//         }))
//         // .pipe(P.sass())
//         .pipe(gulp.dest(path.src + 'css'));
// });


// gulp.task('sass-ignoreError', function() {
//     gulp.src(path.src + 'css/*.scss')
//         // .pipe(P.sass({ compass: true }))        //css排版成一行
//         .pipe(P.plumber()) //忽略错误
//         .pipe(P.compass({
//             css: path.src + 'css',
//             sass: path.src + 'css', //要编译的scss所在目录
//             image: path.src + 'images/sprite/', //icon存放目录,在
//             generated_images_path: path.src + 'images/' //合并后的图片输出路径
//         }))
//         // .pipe(P.sass())
//         .pipe(gulp.dest(path.src + 'css'));
// });

// sass编译,忽略错误
gulp.task('sass-ignoreError', function(){
  gulp.src( path.src + '**/*.scss' )   //拿到源文件
    .pipe(P.plumber())                 //plumber给pipe打补丁,忽略错误,继续执行
    .pipe(P.sass())
    .pipe(gulp.dest( path.src ))      //输出  
    .pipe(P.minifyCss(/*{keepBreaks:true}*/))  
    // .pipe(gulp.dest( path.src ))      //输出    
});
//监听sass,忽略错误
gulp.task('watch', function() {
  gulp.watch(path.src + '**/*.scss', ['sass-ignoreError']);
});
//---------------------------开发时实时编译end---------------------------------------------------





//---------------------------构建上线代码---------------------------------------------------
//清空dist
gulp.task('clean-dist', function (){
  return gulp.src(path.dest)
    .pipe(P.clean());
});

//sass编译,错误会报错
gulp.task('sass-src', function(){
  gulp.src( path.src + '**/*.scss' )   //拿到源文件
    .pipe(P.sass())
    .pipe(gulp.dest( path.src ));      //输出
});

//copy所有文件到dist
gulp.task('copy-src', function () {
  return gulp.src(path.src + '**/*')
    .pipe(gulp.dest(path.dest));
}); 

//清除dist中的sass
gulp.task('cleanSass-dist',  function (){
 return gulp.src(path.dest + '**/*.scss')
    .pipe(P.clean());
});

//压缩dist中的css
gulp.task('cssMin-dist', function(){
  gulp.src( path.dest + '**/*.css' )   //拿到源文件
    .pipe(P.minifyCss(/*{keepBreaks:true}*/))  
    .pipe(gulp.dest( path.dest ));      //输出
});

//压缩dist中的js
gulp.task('jsMin-dist', function(){
  gulp.src( path.dest + '**/*.js' )   //拿到源文件
    .pipe(P.uglify())   
//  .pipe(P.rename({suffix: '.min'}))  //重命名              //压缩
    .pipe(gulp.dest( path.dest ));    //输出
});
// //压缩图片
gulp.task('imgMin-dist', function() {
  gulp.src( path.dest + '**/*.jpg' )  //拿到源文件
    .pipe(P.imagemin({
      // progressive: true,
      // interlaced: true,
      use: [pngquant(), jpegtran()]   //压缩png,有的会自动转成png8
    }))          //压缩
    .pipe(gulp.dest( path.dest ));       //输出
});

var fileName = process.cwd().match(/\\([^\\]+)$/)[1] + '.zip';  //当前目录名
//生成zip文件,并以所在目录名命名
gulp.task('zip', function () {
  gulp.src( path.dest + '**/*')
        .pipe(P.zip(fileName))    //压缩成.zip
        .pipe(gulp.dest('./'));
});



//构建发布用的代码,清空-->sass编译检查-->复制-->【删除.sass, 压缩css, 压缩js】
gulp.task('build', P.sequence(  //处理执行顺序
  'clean-dist',
  'sass-src', 
  'copy-src',
  'cleanSass-dist', 
  ['cssMin-dist', 'jsMin-dist', 'imgMin-dist'], 
  'zip'
));
//---------------------------构建上线代码---------------------------------------------------



//任务提示
gulp.task('default', function () {  
  console.log('$$$');
  console.log('$$$ gulp watch --> 开启实时编译');
  console.log('$$$ gulp build --> 构建上线代码');
  // console.log('$$$ gulp zip ----> 打包压缩成“'+ fileName +'”发给需求方');
  console.log('$$$');
});

