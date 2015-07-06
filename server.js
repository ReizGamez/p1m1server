var express = require('express');
var app = express();
var allRoutes = require('./routes/allRoutes.js');
var http = require('http');

app.use('/', allRoutes.default);
app.use('/users', allRoutes.users);

var server = http.createServer(app);
server.listen(3000);
