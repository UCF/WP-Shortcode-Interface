var gulp       = require('gulp'),
    eslint     = require('gulp-eslint'),
    ifFixed    = require('gulp-eslint-if-fixed'),
    babel      = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify     = require('gulp-uglify'),
    concat     = require('gulp-concat');

var config = {
  src: {
    js: './src/js'
  },
  dist: {
    js: './static/js'
  }
};

gulp.task('eslint', function() {
  return gulp.src(config.src.js + '/**/*.js')
    .pipe(eslint({fix: true}))
    .pipe(eslint.format())
    .pipe(ifFixed(config.src.js));
});

gulp.task('babel', ['eslint'], function() {
  return gulp.src(config.src.js + '/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('wp-scif.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dist.js));
});

gulp.task('js', ['eslint', 'babel']);

gulp.task('watch', function() {
  gulp.watch(config.src.js + '/**/*.js', ['js']);
});

gulp.task('default', ['js']);
