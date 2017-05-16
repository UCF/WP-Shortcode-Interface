var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    scsslint     = require('gulp-scss-lint'),
    cleanCss     = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    ts           = require('gulp-typescript'),
    tslint       = require('gulp-tslint'),
    sourcemaps   = require('gulp-sourcemaps'),
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat'),
    rename       = require('gulp-rename'),
    tsproject    = ts.createProject('tsconfig.json');

var config = {
  src: {
    scss: './src/scss',
    ts: './src/ts'
  },
  dist: {
    css: './static/css',
    js: './static/js'
  }
};

gulp.task('scss-lint', function() {
  gulp.src(config.src.scss + '/**/*.scss')
    .pipe(scsslint());
});

gulp.task('sass', ['scss-lint'], function() {
  gulp.src(config.src.scss + '/wp-scif.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss())
    .pipe(rename('wp-scif.min.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(config.dist.css));
});

gulp.task('css', ['scss-lint', 'sass']);

gulp.task('tslint', function() {
  return gulp.src(config.src.ts + '/**/*.ts')
    .pipe(tslint({
      formatter: 'verbose'
    }));
});

gulp.task('ts', function() {
  return gulp.src(config.src.ts + '/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsproject())
    .pipe(concat('wp-scif.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dist.js));
});

gulp.task('js', ['tslint', 'ts']);

gulp.task('watch', function() {
  gulp.watch(config.src.scss + '/**/*.scss', ['css']);
  gulp.watch(config.src.ts + '/**/*.ts', ['js']);
});

gulp.task('default', ['js']);
