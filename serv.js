var http, open, path, express, keypress;

http = require('http');
open = require('open');
path = require('path');
express = require('express');
keypress = require('keypress');

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
		var url;
		if (host === '127.0.0.1' || host === '0.0.0.0') {
			url = 'http://localhost:' + port
		} else {
			url = 'http://' + host + ':' + port
		}
		console.log('Serving files from ' + mount + ' at ' + url);
		console.log('Press Ctrl+L to launch in browser');
		console.log('Press Ctrl+C to quit');

		keypress(process.stdin);

		process.stdin.on('keypress', function(ch, key) {
			if (!key) {
				return;
			}
			if (key.ctrl && key.name === 'c') {
				process.kill(process.pid, 'SIGINT');
			}
			if (key.ctrl && key.name === 'l') {
				console.log('Launching ' + url + '/');
				open(url + '/');
			}
		});

		process.on('SIGINT', function() {
			process.exit(0);
		});
		process.on('SIGTERM', function() {
			process.exit(0);
		});
		process.on('SIGTTOU', function() {
			process.stdin.pause();
		});

		process.stdin.setRawMode(true);
		process.stdin.resume();
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
