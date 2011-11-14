var http = require('http'),
    express = require('express'),

path = process.env.PWD,
host = '127.0.0.1',
port = process.argv[2] || 8000,
app = express.createServer();

app.configure(function(){
    app.use(app.router);
    app.use(express.static(path));
    app.use(express.directory(path));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

console.log("Serving files from " + path + " at " + host + ":" + port);
app.listen(port, host);
