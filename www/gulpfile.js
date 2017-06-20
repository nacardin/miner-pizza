const gulp = require('gulp');
const nunjucks = require("gulp-nunjucks");
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const mkdirp = require('mkdirp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const async = require('async');

gulp.task('default', ['clean', 'build']);

gulp.task('watch', ['build'], () => {
  browserSync.init({
    server: {
      baseDir: "dist",
      serveStaticOptions: {
        extensions: ['html']
      }
    }
  });
  gulp.watch('./src/**', ['reload']);
});

gulp.task('reload', ['build'], () => browserSync.reload());

gulp.task('clean', () => {
  del.sync('dist');
  mkdirp.sync('dist');
})

gulp.task('build', (done) => {

  async.series([
    (done) => {
      gulp.src(["src/pages/**/*.html", "!src/pages/common/*.html"])
        .pipe(nunjucks.compile({
          year: (new Date()).getFullYear()
        }))
        .pipe(gulp.dest("dist/"))
        .on('end', done);
    },
    (done) => {
      gulp.src('src/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
          include: ['./node_modules/../'],
          outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'))
        .on('end', done);
    },
    (done) => {
      gulp.src('src/static/**')
        .pipe(gulp.dest('dist/'))
        .on('end', done);
    },
    (done) => {
      gulp.src('node_modules/materialize-css/dist/js/materialize.min.js')
        .pipe(gulp.dest('dist/assets/vendor'))
        .on('end', done);
    }
  ], done);

});
