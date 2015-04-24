#!/usr/bin/env node

var serv, app, opts, argv, pkg, keypress, open;

keypress = require('keypress');
open = require('open');

serv = require('../serv');
pkg = require('../package.json');

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
		default: process.env.PORT || 'Auto (8000+)',
		description: 'Port to bind the server to, uses PORT env var if set'
	})
	.options('v', {
		alias: 'version',
		description: 'serv version'
	})
	.options('path', {
		default: process.cwd(),
		description: 'File system path to expose'
	})
	.options('public', {
		boolean: true,
		description: 'Listen on all available IP addresses'
	});
argv = opts.argv;

if (argv.help) {
	opts.showHelp(console.log);
	return;
}

if (argv.version) {
	console.log('serv %s', pkg.version);
	return;
}

argv.path = argv._[0] || argv.path;

app = serv(argv);

app.on('error', function(error) {
	if (error.code === 'EADDRINUSE' && typeof argv.p !== 'number') {
		argv.port += 1;
		app.listen(argv.port);
	} else {
		throw error;
	}
});

app.on('listening', function() {
	var url;
	if (argv.bind === '127.0.0.1' || argv.bind === '0.0.0.0') {
		url = 'http://localhost:' + argv.port + '/';
	} else {
		url = 'http://' + argv.bind + ':' + argv.port + '/';
	}
	console.log('Serving files from ' + argv.mount + ' at ' + url);
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
			console.log('Launching ' + url);
			open(url);
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

app.listen();
