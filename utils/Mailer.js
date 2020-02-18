const awsSdk = require('aws-sdk');

/**
 * 
 * @param {SendRawEmailRequest} params
//    {
//     Source: "Prography <no-reply@prography.org>",
//     Destination: {
//       ToAddresses: [
//         "destination@gmail.com"
//       ]
//     },
//     Message: {
//       Subject: {
//         Charset: "UTF-8",
//         Data: "[프로그라피] 지원서입니다.",
//       },
//       Body: {
//         Html: {
//           Charset: "UTF-8",
//           Data: "<h1>Hello world!</h1>",
//         },
//         Text: {
//           Charset: "UTF-8",
//           Data: "Hello world!",
//         },
//       },
//     },
//   }
*/
async function sendEmail(params) {
  const mailer = new awsSdk.SES({
    region: 'us-west-2',
    apiVersion: '2010-12-01',
  });
  return new Promise((resolve, reject) => {
    mailer.sendEmail(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

exports.sendEmail = sendEmail;
