var gulp        = require('gulp'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    streamify   = require('gulp-streamify'),
    uglify      = require('gulp-uglify'),
    minifyCSS   = require('gulp-minify-css'),
    compass     = require('gulp-compass'),
    modernizr   = require('gulp-modernizr'),
    jade        = require('gulp-jade'),
    merge       = require('merge-stream'),
    concat      = require('gulp-concat'),
    size        = require('gulp-size'),
    browserSync = require('browser-sync'),
    imagemin    = require('gulp-imagemin'),
    changed     = require('gulp-changed'),
    notify      = require('gulp-notify');

handleErrors = function() {
    var args = Array.prototype.slice.call(arguments);

    // Send a notification on error
    notify.onError({
        title: "Compile Error",
        message: "<%= error %>"
    }).apply(this, args);

    // Do not hang on this task
    this.emit('end');
};

bfy = function() {
    var config = {
        entries: './static/js/app.js',
        extensions: ['.js', '.coffee', '.html', '.jade', '.json']
    };

    var b = browserify(config);
    return b.bundle()
        .on('error', handleErrors)
        .pipe(source('app.js'));
};

cp = function() {
    var sass = gulp.src('static/scss/app.scss')
        .pipe(compass({
            config_file: 'config.rb',
            sass: 'static/scss',
            css: '.sass-cache',
            require: ['susy', 'modular-scale']}))
        .on('error', handleErrors);
    return merge(gulp.src(['node_modules/normalize.css/normalize.css', 'node_modules/font-awesome/css/font-awesome.min.css']), sass)
        .pipe(concat('app.css'))
        .pipe(size({title: 'css'}));
};

gulp.task('js', function () {
    var brfy = bfy();
    return merge(brfy.pipe(streamify(modernizr())), brfy)
        .pipe(streamify(concat('app.js')))
        .pipe(streamify(size({title: 'js'})))
        .pipe(gulp.dest('public/javascripts'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('css', function() {
    return cp()
        .pipe(gulp.dest('public/stylesheets'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('js-prod', function () {
    var brfy = bfy();
    return merge(brfy.pipe(streamify(modernizr())), brfy)
        .pipe(streamify(concat('app.js')))
        .pipe(streamify(size({title: 'js'})))
        .pipe(streamify(uglify()))
        .pipe(streamify(size({title: 'js uglified'})))
        .pipe(gulp.dest('public/javascripts'));
});

gulp.task('css-prod', function() {
    return cp()
        .pipe(minifyCSS({keepBreaks: true}))
        .pipe(size({title: 'css minimized'}))
        .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('images', function() {
    return gulp.src('static/images/**/*')
        .pipe(changed('static/images/**/*'))   // Ignore unchanged files
        .pipe(imagemin())                   // Optimize
        .pipe(gulp.dest('public/images'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts', function() {
    return gulp.src(['static/fonts/**/*', 'node_modules/font-awesome/fonts/*'])
        .pipe(changed('static/fonts/**/*'))
        .pipe(changed('node_modules/font-awesome/fonts/*'))
        .pipe(gulp.dest('public/fonts'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function() {
    return gulp.src('static/*.html')
        .pipe(gulp.dest('public'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('jade', function() {
    return gulp.src('static/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('public'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('prod', ['jade', 'images', 'fonts', 'css-prod', 'js-prod']);
gulp.task('dev', ['jade', 'images', 'fonts', 'css', 'js']);

gulp.task('watch', ['dev'], function() {
    browserSync({server: {baseDir: 'public'}, ui: false, open: false});
    gulp.watch('static/scss/**/*.scss', ['css']);
    gulp.watch('static/js/**/*', ['js']);
    gulp.watch('static/images/**/*', ['images']);
    gulp.watch('static/*.html', ['html']);
    gulp.watch('static/*.jade', ['jade']);
});

gulp.task('default', ['watch']);
