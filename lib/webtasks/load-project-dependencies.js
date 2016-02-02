var async = require('async');
var AWS = require('aws-sdk');
var GitHubApi = require('github');
var request = require('request');

return function (context, req, res) {
  var projects = {};
  var body = '';
  var s3;
  var commitId;
  var rawUrl;
  var dependencies;

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
        if (err) {
          return cb(err);
        }

        if (data.Body) {
          projects = JSON.parse(data.Body);
        }

        cb();
      });
    },
    function(cb) {
      if (body.ref !== 'refs/heads/master') {
        return cb();
      }

      body.commits.filter(function(item) {
        if (item.added.indexOf('package.json') > -1 ||
            item.modified.indexOf('package.json') > -1) {
          commitId = item.id;
        }
      });

      cb();
    },
    function(cb) {
      if (!commitId) {
        return cb();
      }

      var project = projects[body.repository.name];

      if (!project) {
        return cb();
      }

      var github = new GitHubApi({ version: '3.0.0' });
      github.authenticate({
        type: 'token',
        token: context.data.GITHUB_TOKEN
      });
      github.getCommit({
        user: project.owner,
        repo: body.repository.name,
        sha: commitId
      }, function(err, commit) {
        if (err) {
          return cb(err);
        }

        commit.files.filter(function(item) {
          if (item.filename === 'package.json') {
            rawUrl = item.raw_url;
          }
        });

        cb();
      });
    },
    function(cb) {
      if (!rawUrl) {
        return cb();
      }

      var options = {
        url: rawUrl,
        headers: {
          'Authorization': 'token ' + context.data.GITHUB_TOKEN,
          'Accept': 'application/vnd.github.v3.raw'
        }
      };
      request(options, function(err, res, body) {
        if (err) {
          return cb(err);
        }

        dependencies = JSON.parse(body).dependencies;
        cb();
      });
    },
    function(cb) {
      if (!dependencies) {
        return cb();
      }

      projects[body.repository.name] = {
        dependencies: dependencies,
        packageJsonLocation: rawUrl
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