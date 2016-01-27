# Auth0 Dependency Checker

## Requirements
- [webtask.io](https://webtask.io)

## Install

### Create project webtask

Run
<pre>
echo https://webtask.it.auth0.com/api/run/<strong><em>%your_container%</em></strong>?key=$(curl -s https://webtask.it.auth0.com/api/tokens/issue -H "Authorization: Bearer <strong><em>%your_token%</em></strong>" -H "Content-Type: application/json" --data-binary '{"url":"https://raw.githubusercontent.com/ezequielm/auth0-dependency-checker/master/lib/webtasks/create-project.js", "ectx": {"AWS_S3_ACCESS_KEY_ID": " <strong><em>"{aws_s3_access_key_id}</em></strong>", "AWS_S3_SECRET_KEY": "<strong><em>%aws_s3_secret_key%</em></strong>", "AWS_S3_BUCKET": "auth0-dependency-checker", "AWS_S3_KEY": "projects.json"}}')
</pre>

Next, install the generated URL as a GitHub repository web hook for your organization.

### Detect project dependencies webtask
*TBC*

### Detect dependency update webtask
*TBC*
