/**
 * Author: Ivan
 * create: 2015.04.20
 * update: 2015.05.08
 */
var gulp = require('gulp');
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
//1.清空dist
gulp.task('clean-dist-all', function (){
  return gulp.src(path.dest)
    .pipe(P.clean());
});

//2.sass编译,错误会报错
gulp.task('sass', function(){
  gulp.src( path.src + '**/*.scss' )   //拿到源文件
    .pipe(P.sass())
    .pipe(gulp.dest( path.src ));      //输出
});

//3.copy所有文件到dist,copy之前要清空和sass编译检查
gulp.task('copy-all', ['clean-dist-all', 'sass'], function () {
  return gulp.src(path.src + '**/*')
    .pipe(gulp.dest(path.dest));
}); 

//4.清除dist中的sass
gulp.task('clean-dist-sass', ['copy-all'],  function (){
  gulp.src(path.dest + '**/*.scss')
    .pipe(P.clean());
});

//5.压缩dist中的css
gulp.task('cssmin', ['clean-dist-sass'], function(){
  gulp.src( path.dest + '**/*.css' )   //拿到源文件
    .pipe(P.minifyCss(/*{keepBreaks:true}*/))  
    .pipe(gulp.dest( path.dest ));      //输出
});

//6.压缩dist中的js
gulp.task('jsmin', ['cssmin'], function(){
  gulp.src( path.dest + '**/*.js' )   //拿到源文件
    .pipe(P.uglify())                 //压缩
    .pipe(gulp.dest( path.dest ));    //输出
});

//生成zip文件,并以所在目录名命名
gulp.task('zip', function () {
  var fileName = process.cwd().match(/\\([^\\]+)$/)[1] + '.zip';    //当前目录名
  gulp.src( path.dest + '*')
        .pipe(P.zip(fileName))    //压缩成.zip
        .pipe(gulp.dest('./'));
})
//构建发布用的代码,清空-->sass编译检查-->复制-->删除.sass-->压缩css
gulp.task('build', ['jsmin']);
//---------------------------构建上线代码---------------------------------------------------

  







// //压缩js
// gulp.task('jsmin', function() {
//   gulp.src( path.src + '**/*.js' )   //拿到源文件
//     .pipe(P.uglify())          //压缩
//     .pipe(P.rename({suffix: '.min'}))  //重命名
//     .pipe(gulp.dest( path.dest ));   //输出
// });

// //压缩css
// gulp.task('cssmin', function() {
//   gulp.src( path.src + '**/*.css' )    //拿到源文件
//     .pipe(P.minifyCss())         //压缩
//     .pipe(P.rename({ extname: '.css' }))
//     .pipe(gulp.dest( path.dest ));     //输出
// });

// //压缩图片
// gulp.task('imgmin', function() {
//   gulp.src( path.src + '**/*' )  //拿到源文件
//     .pipe(P.imagemin())          //压缩
//     .pipe(gulp.dest( path.dest ));       //输出
// });
// 
// 
