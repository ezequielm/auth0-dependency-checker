var async = require('async');
var AWS = require('aws-sdk');

return function (context, req, res) {
  var body = '';

  async.series([
    function(cb) {
      req.on('data', function (chunk) {
        body += chunk;
      });
      req.on('end', function () {
        try {
          body = JSON.parse(body);
        }
        catch (e) {
          return cb(e);
        }
        cb();
      });
    },
    function(cb) {
      var s3 = new AWS.S3({
        accessKeyId: context.data.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: context.data.AWS_S3_SECRET_KEY
      });

      s3.putObject({
        Bucket: context.data.AWS_S3_BUCKET,
        Key: context.data.AWS_S3_KEY,
        Body: JSON.stringify(body)
      }, cb);
    }
  ], function(err) {
    try {
      if (error) {
        console.log('ERROR', error);
        res.writeHead(500);
        res.end(error.toString());
      }
    }
    catch (e) {
        // ignore
    }
  });
}