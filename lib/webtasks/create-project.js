var async = require('async');
var AWS = require('aws-sdk');

return function (context, req, res) {
  var projects = {};
  var body = '';
  var s3;

  async.series([
    function(cb) {
      req.on('data', function (chunk) {
        body += chunk;
      });
      req.on('end', function () {
        try {
          body = JSON.parse(body);

          s3 = new AWS.S3({
            accessKeyId: context.data.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: context.data.AWS_S3_SECRET_KEY
          });
        }
        catch (e) {
          return cb(e);
        }
        cb();
      });
    },
    function(cb) {
      s3.getObject({
        Bucket: context.data.AWS_S3_BUCKET,
        Key: context.data.AWS_S3_KEY
      }, function(err, data) {
        if (err && err.code !== 'NoSuchKey') {
          return cb(err);
        }

        if (data && data.Body) {
          projects = JSON.parse(data.Body);
        }

        cb();
      });
    },
    function(cb) {
      projects[body.repository.name] = {
        url: body.repository.url,
        owner: body.repository.owner.login || body.repository.owner.name
      };

      s3.putObject({
        Bucket: context.data.AWS_S3_BUCKET,
        Key: context.data.AWS_S3_KEY,
        Body: JSON.stringify(projects)
      }, cb);
    }
  ], function(err) {
    try {
      if (err) {
        console.log('ERROR', err);
        res.writeHead(500);
        res.end(err.toString());
      }
    }
    catch (e) {
        // ignore
    }
  });
}