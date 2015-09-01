var app = require('./app');
var http = require('http');
var socketio = require('socket.io')

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

var io = socketio.listen(server);

io.on('connection', ioConnection);

function ioConnection(socket) {
	global.socket = socket;
  global.sockets = io.sockets;
};

var port;
if (app.get('env') === 'development') {
   app.use(function(err, req, res, next) {
     res.status(err.status || 500);
     res.render('error', {
       message: err.message,
       error: err
     });
   });
  port = parseInt(process.env.PORT, 10) || 3000
}

if (app.get('env') === 'production') {
	 //production error handler
	 //no stacktraces leaked to user
	 app.use(function(err, req, res, next) {
	 	res.status(err.status || 500);
	 	res.render('error', {
	 	  message: err.message,
	 	  error: {}
	 	});
	 });

	port = parseInt(process.env.PORT, 10) || 8080
}
app.set('port', port);

server.listen(port);

server.on('error', onError);
server.on('listening', onListening);


function onError(error) {
}

function onListening() {
  console.log('Listening on port ' + server.address().port);
}