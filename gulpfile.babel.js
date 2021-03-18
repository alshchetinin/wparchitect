import { src, dest, watch, series, parallel} from 'gulp';
import browserSync from "browser-sync";
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import purgecss  from'@fullhuman/postcss-purgecss'
// const autoprefixer = require("gulp-autoprefixer");
const autoprefixer = require('autoprefixer');
import imagemin from 'gulp-imagemin';
import del from 'del';
import zip from "gulp-zip";
import replace from "gulp-replace";
import fs from 'fs'
import atImport from 'postcss-import'
import info from "./package.json";


const PRODUCTION = yargs.argv.prod;
const css = fs.readFileSync("./src/css/bundle.css", "utf8")

export const styles = () => {
  const plugins =[    
    require('autoprefixer'),
    purgecss({
      content: ['./**/*.php', './src/**/*.js', './**/*.js'],
      safelist: {
        standard: [/^has-/, /^align/, /^wp-/]
      },
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]

  return src('src/css/*.css')
  .pipe(postcss([require('tailwindcss'),
  require('postcss-import')])) 
  .pipe(gulpif(PRODUCTION, postcss(plugins)))
  .pipe(dest('dist/css'))
  .pipe(server.stream());
}




export const scripts = () => {
  return src(['src/js/bundle.js','src/js/admin.js'])
    .pipe(named())
    .pipe(webpack({
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: []
            }
          }
        }
      ]
    },
    mode: PRODUCTION ? 'production' : 'development',
    devtool: !PRODUCTION ? 'inline-source-map' : false,
    output: {
      filename: '[name].js'
    },
    externals: {
      jquery: 'jQuery'
    },
  }))
  .pipe(dest('dist/js'));
}


export const clean = () => {
  return del(['dist']);
}

export const copy = () => {
  return src(['src/**/*','!src/{images,js,css}','!src/{images,js,css}/**/*'])
    .pipe(dest('dist'));
}

export const images = () => {
  return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(dest('dist/images'));
}

export const watchForChanges = () => {
  watch('src/css/**/*.css', series(styles, reload));
  watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images, reload));
  watch(['src/**/*','!src/{images,js,scss}','!src/{images,js,scss}/**/*'], series(copy, reload));
  watch(['src/js/**/*.js', 'components/**/*.js'], series(scripts, reload));
  watch("**/*.php", reload);
}

const server = browserSync.create();
export const serve = done => {
  server.init({
    proxy: "http://thearchitect.local/" // put your local website link here
  });
  done();
};
export const reload = done => {
  server.reload();
  done();
};

export const compress = () => {
  return src([
      "**/*",
      "!node_modules{,/**}",
      "!bundled{,/**}",
      "!src{,/**}",
      "!.babelrc",
      "!.gitignore",
      "!gulpfile.babel.js",
      "!package.json",
      "!package-lock.json",
    ])
    .pipe(replace("_themename", info.name))
    .pipe(zip(`${info.name}.zip`))
    .pipe(dest('bundled'));
  };


export const dev = series(clean, parallel(styles, images, copy, scripts), serve, watchForChanges);
export const build = series(clean, parallel(styles, images, copy, scripts), compress);
export default dev;

