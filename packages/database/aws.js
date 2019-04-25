const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: process.env.ZEIT_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.ZEIT_AWS_SECRET_ACCESS_KEY,
  region: process.env.ZEIT_AWS_REGION
});

module.exports = aws;
