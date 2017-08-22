var gulp = require('gulp');
var exec = require('child_process').exec;
var git = require('gulp-git');
var gulpSequence = require('gulp-sequence')

//RUN npm run build cmd  打包命令
gulp.task('build', function (cb) {
    exec('npm run build', function (err, stdout, stderr) {
        cb(err);
    });
});
//RUN cd进到子目录 child
//**********************
var child='admin'  //设置子目录变量名
gulp.task('child', function (cb) {
    exec('cd '+child, function (err, stdout, stderr) {
        cb(err);
    });
});
// cmd back
gulp.task('back', function (cb) {
    exec('cd ..', function (err, stdout, stderr) {
        cb(err);
    });
});

//Run git add  注意目录结构调整！！！
gulp.task('add', function(){
    return gulp.src(['./dist/*.*','./src/*','./*.*'])
        .pipe(git.add());
});

//// Run git commit    注意目录结构调整！！！
gulp.task('commit', function(){
    return gulp.src(['./dist/*.*','./src/*','./*.*'])
        .pipe(git.commit('ordinary commit'));
    //return gulp.src(['./*.*','./*/'])
    //    .pipe(git.commit('ordinary commit'));

});

//// Run git push
gulp.task('runpush', function(){
    git.push('origin', 'master', function (err) {
        if (err) throw err;
    });
});

//// Run git pull
gulp.task('pull', function(){
    git.pull('origin', 'master', {args: '--rebase'}, function (err) {
        if (err) throw err;
    });
});


//  默认  gulp 命令执行build打包，并且推送到仓库
gulp.task( 'default', gulpSequence( 'build','add','commit', 'runpush'));
//  默认  gulp childbuild 命令执行子目录build打包，并且推送到仓库，子目录名在上面child变量中设置
gulp.task( 'childbuild', gulpSequence( 'child','build','back','commit', 'runpush'));
//    gulp push 命令执行推送到仓库,不执行打包
gulp.task( 'push', gulpSequence( 'commit', 'runpush'));