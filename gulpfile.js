/**
 * Author: Ivan
 * update: 2015.04.20
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

//清空dist
gulp.task('clean-dist-all', function (){
  return gulp.src(path.dest)
    .pipe(P.clean());
});

//less编译,错误会报错
gulp.task('less-src', function(){
  gulp.src( path.src + '**/*.less' )   //拿到源文件
    .pipe(P.less())
    .pipe(gulp.dest( path.src ));      //输出
});

//copy到dist,copy之前要清空和less编译检查
gulp.task('copy-all', ['clean-dist-all', 'less-src'], function () {
  return gulp.src(path.src + '**/*')
    .pipe(gulp.dest(path.dest));
}); 

//清除dist中的less
gulp.task('clean-dist-less', ['copy-all'],  function (){
  gulp.src(path.dest + '**/*.less')
    .pipe(P.clean());
});



//开发时实时编译---------------------------------------------------

//less编译,忽略错误
gulp.task('less-src-ignoreError', function(){
  gulp.src( path.src + '**/*.less' )   //拿到源文件
    .pipe(P.plumber())                 //plumber给pipe打补丁,忽略错误,继续执行
    .pipe(P.less())
    .pipe(gulp.dest( path.src ));      //输出
});

//监听less,忽略错误
gulp.task('watch-less', function() {
  gulp.watch(path.src + '**/*.less', ['less-src-ignoreError']);
});

//开发时实时编译end---------------------------------------------------



//发布,清空-->less编译检查-->复制-->删除.less
gulp.task('build', ['clean-dist-less']);







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
