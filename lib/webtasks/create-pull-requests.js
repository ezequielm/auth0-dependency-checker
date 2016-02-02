var async = require('async');
var AWS = require('aws-sdk');
var GitHubApi = require('github');
var request = require('request');

return function (context, req, res) {
  var projects = {};
  var body = '';
  var s3;
  var jobs;

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
      // TO-DO: refactor to reduce cyclomatic complexity
      for (var project in projects) {
        if (projects.hasOwnProperty(project)) {
          for (var dependency in projects[project].dependencies) {
            if (projects[project].dependencies.hasOwnProperty(dependency)) {
              if (body.repository.name === dependency) {
                var job = {
                  project: projects[project],
                  change: {
                    dependency: dependency,
                    new: body.git_url + '#' + body.release.tag_name
                  }
                };
                job.project.name = project;
                jobs.push(job);
              }
            }
          }
        }
      }
      cb();
    },
    function(cb) {
      if (!jobs) {
        return cb();
      }

      var baseUrl = '';

      var shaLatestCommit = '';
      var shaBaseTree = '';
      var shaNewTree = '';
      var shaNewCommit = '';
      var updatedPackageJson = {};
      var newBranchName = 'update-' + body.repository.name + '-' + body.release.tag_name;

      var github = new GitHubApi({ version: '3.0.0' });
      github.authenticate({
        type: 'token',
        token: context.data.GITHUB_TOKEN
      });

      // TO-DO: refactor to avoid async concatenation
      async.map(jobs, function(job, next) {
        async.series([
          //Get the SHA for the latest commit
          function(callb) {
            baseUrl = 'https://api.github.com/repos/' + job.project.owner + '/' + job.project.name + '/git';
            var options = {
              url: baseUrl + '/refs/heads/master',
              headers: {
                'Authorization': 'token ' + context.data.GITHUB_TOKEN
              }
            };
            request(options, function(err, res, body) {
              if (err) {
                return callb(err);
              }

              shaLatestCommit = body;
              callb();
            });
          },
          //Get the SHA for the tree
          function(callb) {
            if (!shaLatestCommit) {
              return callb();
            }

            var options = {
              url: baseUrl + '/commits' + shaLatestCommit,
              headers: {
                'Authorization': 'token ' + context.data.GITHUB_TOKEN
              }
            };
            request(options, function(err, res, body) {
              if (err) {
                return callb(err);
              }

              shaBaseTree = body;
              callb();
            });
          },
          //Create branch
          function(callb) {
            if (!shaLatestCommit) {
              return callb('shaLatestCommit is missing');
            }

            var options = {
              url: baseUrl + '/refs',
              headers: {
                'Authorization': 'token ' + context.data.GITHUB_TOKEN
              },
              json: true,
              method: 'POST',
              body: {
                ref: 'refs/heads' + newBranchName,
                sha: shaLatestCommit
              }
            };
            request(options, callb);
          },
          //Update package.json
          function(callb) {
            var options = {
              url: job.project.packageJsonLocation,
              headers: {
                'Authorization': 'token ' + context.data.GITHUB_TOKEN,
                'Accept': 'application/vnd.github.v3.raw'
              }
            };
            request(options, function(err, res, body) {
              if (err) {
                return cb(err);
              }

              updatedPackageJson = JSON.parse(body);
              updatedPackageJson.dependencies[job.change.dependency] = job.change.new;

              callb();
            });
          },
          //Create tree
          function(callb) {
            if (!shaBaseTree || !updatedPackageJson) {
              return callb('shaBaseTree or updatedPackageJson is missing');
            }

            var options = {
              url: baseUrl + '/trees/',
              headers: {
                'Authorization': 'token ' + context.data.GITHUB_TOKEN
              },
              json: true,
              method: 'POST',
              body: {
                base_tree: shaBaseTree,
                path: 'package.json',
                content: JSON.stringify(updatedPackageJson)
              }
            };
            request(options, function(err, res, body) {
              if (err) {
                return callb(err);
              }

              shaNewTree = body;
              callb();
            });
          },
          //Create commit
          function(callb) {
            if (!shaNewTree || !shaLatestCommit) {
              return callb('shaNewTree or shaLatestCommit is missing');
            }

            var options = {
              url: baseUrl + '/commits',
              headers: {
                'Authorization': 'token ' + context.data.GITHUB_TOKEN
              },
              json: true,
              method: 'POST',
              body: {
                parents: shaLatestCommit,
                tree: shaNewTree
              }
            };
            request(options, function(err, res, body) {
              if (err) {
                return callb(err);
              }

              shaNewCommit = body;
              callb();
            });
          },
          //Add commit to branch
          function(callb) {
            if (!shaNewCommit) {
              return callb('shaNewCommit is missing');
            }

            var options = {
              url: baseUrl + '/refs/head/' + newBranchName,
              headers: {
                'Authorization': 'token ' + context.data.GITHUB_TOKEN
              },
              json: true,
              method: 'POST',
              body: {
                sha: shaNewCommit
              }
            };
            request(options, callb);
          },
          //Create PR
          function(callb) {
            if (!shaNewTree || !shaLatestCommit || !shaNewCommit || !shaBaseTree || !updatedPackageJson) {
              return callb('param is missing');
            }

            github.pullRequests.create({
              user: job.project.owner,
              repo: job.project.name,
              title: newBranchName,
              base: 'refs/heads/master',
              head: 'refs/heads/' + newBranchName
            }, callb);
          }
        ], next);
      }, cb);
    }
  ], function(err) {
    try {
      if (err) {
        console.log('ERROR', err);
        res.writeHead(500);
        res.end(err.toString());
        return;
      }

      res.writeHead(200);
      res.end();
    }
    catch (e) {
        // ignore
    }
  });
}