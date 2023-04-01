import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
const parameters = JSON.parse(readFileSync(0, { encoding: "utf8" }));

const CWR_SCRIPT_VERSION = "1.13.6";

const amplifyMetaFile = JSON.parse(
  readFileSync(
    join(
      parameters.data.amplify.environment.projectPath,
      "amplify",
      "backend",
      "amplify-meta.json"
    )
  )
);

const { custom, providers } = amplifyMetaFile;
// Change the name of resourceName below to your Amplify-created resource name if different
const { cloudwatchrum } = custom;
const appMonitorId = cloudwatchrum.output.AppMonitorId;
const appMonitorGuestRoleArn = cloudwatchrum.output.GuestRoleArn;
const appMonitoridentityPoolId = cloudwatchrum.output.IdentityPoolId;
const awsRegion = providers.awscloudformation.Region;

writeFileSync(
  join(parameters.data.amplify.environment.projectPath, "index.html"),
  `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="Amazon CloudWatch RUM x AWS Amplify" />
  <title>Amazon CloudWatch RUM x AWS Amplify</title>
  <script>
    if (global === undefined) {
      var global = window;
    }
  </script>
  <script>
  (function (n, i, v, r, s, c, x, z) {
    x = window.AwsRumClient = { q: [], n: n, i: i, v: v, r: r, c: c };
    window[n] = function (c, p) { x.q.push({ c: c, p: p }); };
    z = document.createElement('script');
    z.async = true; z.src = s;
    document.head.insertBefore(z, document.head.getElementsByTagName('script')[0]);
  })(
    'cwr',
    '${appMonitorId}',
    '1.0.0',
    '${awsRegion}',
    'https://client.rum.us-east-1.amazonaws.com/${CWR_SCRIPT_VERSION}/cwr.js',
    {
      sessionSampleRate: 1,
      guestRoleArn: "${appMonitorGuestRoleArn}",
      identityPoolId: "${appMonitoridentityPoolId}",
      endpoint: "https://dataplane.rum.${awsRegion}.amazonaws.com",
      telemetries: ["performance", "errors", "http"],
      allowCookies: true,
      enableXRay: true
    });
  </script>
</head>

<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>

</html>`
);
console.log("Successfully updated index.html with CloudWatch RUM code snippet");
