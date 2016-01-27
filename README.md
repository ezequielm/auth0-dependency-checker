# Auth0 Dependency Checker

## Requirements
- [webtask.io](https://webtask.io)

## Install

### Create project webtask

Run
`
echo https://webtask.it.auth0.com/api/run/***%your_container%***?key=$(curl -s https://webtask.it.auth0.com/api/tokens/issue -H "Authorization: Bearer ***%your_token%***" -H "Content-Type: application/json" --data-binary '{"url":"https://raw.githubusercontent.com/ezequielm/auth0-dependency-checker/master/lib/webtasks/create-project.js", "ectx": {"AWS_S3_ACCESS_KEY_ID": "***"{aws_s3_access_key_id}***"", "AWS_S3_SECRET_KEY": "***"%aws_s3_secret_key%***"", "AWS_S3_BUCKET": "auth0-dependency-checker", "AWS_S3_KEY": "projects.json"}}')
`

Next, install the generated URL as a GitHub repository web hook for your organization.

### Detect project dependencies webtask
*TBC*

### Detect dependency update webtask
*TBC*
