# gulp-marko

Gulp plugin to compile [Marko](https://github.com/raptorjs/marko) templates to html. It also supports the optimizer taglib and writes resources into a static directory.

## Usage

First, install `gulp-marko` as a dependency:

```shell
npm install --save gulp-marko
```

Then, add it to your `gulpfile.js`:

```javascript
var marko = require('gulp-marko');

gulp.task('marko', function(){
  gulp.src(['src/*.marko'])
  .pipe(marko({
      renderParams: {
          title: 'Hello World'
      }
  }))
  .pipe(gulp.dest('build'));
});

```

You can also pass a specific [Optimizer](https://github.com/raptorjs/optimizer) config:

```javascript
gulp.src('src/*.marko')
    .pipe(marko({
        optimizer: {
            outputDir: 'build/static'
			plugins: [
				'optimizer-marko',
				'optimizer-less'
			],
			urlPrefix: './static',
			fingerprintsEnabled: false,
			bundlingEnabled: false
		}
    }))
    .pipe(gulp.dest('build'));
```

Run the following command to generate the html with css and js files inside static folder and references of those files are added into the html file:

```bash
gulp marko
```

This should generate the html file in ```build/```

## Use it for tests

It is very useful if you want to do some functional testing of components. This example uses [mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs) to render the html and run the tests. Please check their repo for an example file.

```javascript
var gulp = require('gulp');
	mochaPhantomJS = require('gulp-mocha-phantomjs'),
	marko = require('gulp-marko'),
	clean = require('gulp-clean');

gulp.task('test', function () {
	return gulp
	.src('test/build', {read: false})
	.pipe(clean())
	.on('finish', function () {
		gulp.src('test/client/test.marko') // test file
		.pipe(marko({
			optimizer: {
				outputDir: 'test/build/static'
			}
		}))
		.pipe(gulp.dest('test/build'))
		.on('finish', function () {
			gulp.src('test/build/*.marko.html')
			.pipe(mochaPhantomJS());
		});
	});
});
```
