#!/usr/bin/env node

var serv, opts, argv;

serv = require('../serv');

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
		default: process.env.PORT || 8000,
		description: 'port to bin the server to, uses PORT env var if set'
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

argv.path = argv._[0] || argv.path;

serv(argv);
