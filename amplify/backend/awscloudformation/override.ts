import { AmplifyRootStackTemplate } from "@aws-amplify/cli-extensibility-helper";

export function override(resources: AmplifyRootStackTemplate) {
  // Give permissions to perform the rum:PutEvents action to the authenticated role
  // & change the name so we can reference it later
  const authRole = resources.authRole;
  authRole.roleName = "amplify-amplifycloudwatchrum-authRole";
  const authRoleBasePolicies = Array.isArray(authRole.policies)
    ? authRole.policies
    : [authRole.policies];

  authRole.policies = [
    ...authRoleBasePolicies,
    {
      policyName: "cloudwatch-rum-put-events",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            // Replace AWS Region and Account ID (https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)
            // of your Amplify project, as well as the correct project’s name and environment.
            Resource:
              "arn:aws:rum:[aws-region]:[aws-account-id]:appmonitor/app-monitor-[amplify-project-name]-[env]",
            Action: ["rum:PutRumEvents"],
          },
        ],
      },
    },
  ];

  // Give permissions to perform the rum:PutEvents action to the unauthenticated role
  // & change the name so we can reference it later
  const unauthRole = resources.unauthRole;
  unauthRole.roleName = "amplify-amplifycloudwatchrum-unauthRole";
  const unauthRoleBasePolicies = Array.isArray(unauthRole.policies)
    ? unauthRole.policies
    : [unauthRole.policies];

  unauthRole.policies = [
    ...unauthRoleBasePolicies,
    {
      policyName: "cloudwatch-rum-put-events",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            // Replace AWS Region and Account ID (https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)
            // of your Amplify project, as well as the correct project’s name and environment.
            Resource:
              "arn:aws:rum:[aws-region]:[aws-account-id]:appmonitor/app-monitor-[amplify-project-name]-[env]",
            Action: ["rum:PutRumEvents"],
          },
        ],
      },
    },
  ];
}
