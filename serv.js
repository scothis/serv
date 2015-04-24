var http, path, express;

http = require('http');
path = require('path');
express = require('express');

module.exports = function serv(opts) {
	var mount, host, port, app;

	opts = opts || {};
	mount = opts.path = path.resolve(opts.path || '');
	host = opts.bind = opts.public ? '0.0.0.0' : opts.bind;
	port = opts.port = typeof opts.port === 'number' ? opts.port : 8000;

	app = express.createServer();
	app.configure(function(){
		app.use(express.static(mount));
		app.use(express.directory(mount));
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	var listen = app.listen;
	app.listen = function () {
		listen.call(app, arguments[0] || port, arguments[1] || host);
	};

	return app;
};
