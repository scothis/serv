#!/usr/bin/env node

var http, path, express, opts, argv, mount, host, port, app;

http = require('http');
path = require('path');
express = require('express');

opts = require('optimist')
	.options('h', {
		alias: 'help',
		boolean: true,
		description: 'Show this help message'
	})
	.options('b', {
		alias: 'bind',
		default: '127.0.0.1',
		description: 'IP to bind the server to'
	})
	.options('p', {
		alias: 'port',
		default: 8000,
		description: 'port to bin the server to'
	})
	.options('path', {
		default: process.cwd(),
		description: 'file system path to expose'
	})
	.options('public', {
		boolean: true,
		description: 'Change the default host to 0.0.0.0'
	});
argv = opts.argv;

if (argv.help) {
	opts.showHelp(console.log);
	return;
}

mount = path.resolve(argv._[0] || argv.path);
host = argv.public ? '0.0.0.0' : argv.bind;
port = argv.port;
app = express.createServer();

app.configure(function(){
	app.use(express.static(mount));
	app.use(express.directory(mount));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

console.log('Serving files from ' + mount + ' at http://' + host + ':' + port);
app.listen(port, host);
