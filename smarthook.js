return function (context, req, res) {
  var body = '';

  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    try {
      body = JSON.parse(body);
    }
    catch (e) {
      res.writeHead(500, {"Content-Type": "application/json"});
      return res.end(e);
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(body);
  });
}