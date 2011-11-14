var http = require('http'),
    express = require('express'),

path = process.env.PWD,
port = process.argv[2] || 8000,
app = express.createServer();

app.configure(function(){
    app.use(app.router);
    app.use(express.static(path));
    app.use(express.directory(path));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

console.log("Serving files from " + path + " at localhost:" + port);
app.listen(port);
