var through2 = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var marko = require('marko');
var optimizer = require('optimizer');
var extend = require('node.extend');
var PluginError = gutil.PluginError;

module.exports = function(options) {
	var defaultResourceDir = '/static';

	options = extend(true, {
		optimizer: {
			plugins: [
				'optimizer-marko',
				'optimizer-less'
			],
			urlPrefix: '.' + defaultResourceDir,
			fingerprintsEnabled: false,
			bundlingEnabled: false
		}
	}, options);

	return through2.obj(function(file, enc, cb) {
		var _this = this;

		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isStream()) {
			return cb(new PluginError('gulp-marko', 'Streaming not supported'));
		}

		var outputDir = path.dirname(file.path);
		if (!options.optimizer.outputDir) {
			options.optimizer.outputDir = outputDir + defaultResourceDir;
		}

		optimizer.configure(options.optimizer);

		var template = marko.load(file.path);

		// options.renderOptions || {}
		template.render(options.renderParams, function (err, out) {
			if (err) {
				return _this.emit('error', new PluginError('gulp-marko',  'Rendering failed', err));
			}

			file.contents = new Buffer(out);
			file.path = file.path + '.html';

			_this.push(file);
			cb(err);
		});
	});
};
