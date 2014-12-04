var http, path, express;

http = require('http');
path = require('path');
express = require('express');

module.exports = function serv(opts) {
	var mount, host, port, app;

	mount = path.resolve(opts.path);
	host = opts.public ? '0.0.0.0' : opts.bind;
	port = opts.port;

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
		if (error.code !== 'EADDRINUSE') {
			throw error;
		}
		port += 1;
		app.listen(port, host);
	});

	app.listen(port, host);

};
