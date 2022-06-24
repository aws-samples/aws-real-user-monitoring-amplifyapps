const fs = require('fs');
const path = require('path');
const parameters = JSON.parse(fs.readFileSync(0, { encoding: 'utf8' }));

const amplifyMetaFile = JSON.parse(fs.readFileSync(path.join(
  parameters.data.amplify.environment.projectPath,
  'amplify',
  'backend',
  'amplify-meta.json'
)));

const { custom, providers } = amplifyMetaFile;
// Change the name of resourceName below to your Amplify-created resource name if different
const { cloudwatchrum } = custom;

console.log('Copy/paste these values in public/index.html with CloudWatch RUM code snippet below');

console.log(`appMonitorId ${cloudwatchrum.output.AppMonitorId}`);
console.log(`appMonitorGuestRoleArn ${cloudwatchrum.output.GuestRoleArn}`);
console.log(`appMonitoridentityPoolId ${cloudwatchrum.output.IdentityPoolId}`);
console.log(`awsRegion ${providers.awscloudformation.Region}`);