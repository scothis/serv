var http, path, express;

http = require('http');
path = require('path');
express = require('express');

module.exports = function serv(opts) {
	var mount, host, port, app, isUserSpecifiedPort;

	mount = path.resolve(opts.path);
	host = opts.public ? '0.0.0.0' : opts.bind;
	isUserSpecifiedPort = (typeof opts.port === 'number');
	port = isUserSpecifiedPort ? opts.port : 8000;

	app = express.createServer();
	app.configure(function(){
		app.use(express.static(mount));
		app.use(express.directory(mount));
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.on('listening', function() {
		console.log('Serving files from ' + mount + ' at http://' + host + ':' + port);
	});

	app.on('error', function(error) {
		if (error.code === 'EADDRINUSE' && !isUserSpecifiedPort) {
			port += 1;
			app.listen(port, host);
		} else {
			throw error;
		}
	});

	app.listen(port, host);

};
