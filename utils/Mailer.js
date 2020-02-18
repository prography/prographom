const awsSdk = require('aws-sdk');

async function sendRawEmail(params) {
  const mailer = new awsSdk.SES({
    region: 'us-west-2',
    apiVersion: '2010-12-01',
  });
  return new Promise((resolve, reject) => {
    mailer.sendRawEmail(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

exports.sendRawEmail = sendRawEmail;
