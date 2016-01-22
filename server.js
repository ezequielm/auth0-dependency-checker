'use strict';
var cluster = require('cluster');

if(cluster.isMaster) {
  var numWorkers = 1;

  if (process.env.NODE_ENV === 'production') {
    numWorkers = require('os').cpus().length;
  }

  console.log('Master cluster setting up %s workers', numWorkers);

  for(var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', function(worker) {
    console.log('Worker %s is online', worker.process.pid);
  });

  cluster.on('exit', function() {
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  var api = require('./lib/config/api');
  var http = require('http');

  var server = http.createServer(api);

  server.listen(process.env.PORT || 9000);
  server.on('listening', function() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  });
}
