#!/usr/bin/env node

var http, express, path, binding, host, port, app;

http = require('http');
express = require('express');

path = process.env.PWD;
binding = (process.argv[2] || '').split(':');
host = binding.length > 1 ? binding[0] : '127.0.0.1';
port = binding[binding.length - 1] || 8000;
app = express.createServer();

app.configure(function(){
    app.use(express.static(path));
    app.use(express.directory(path));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

console.log("Serving files from " + path + " at " + host + ":" + port);
app.listen(port, host);
