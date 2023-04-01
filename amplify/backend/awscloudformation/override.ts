import {
  AmplifyProjectInfo,
  AmplifyRootStackTemplate,
} from "@aws-amplify/cli-extensibility-helper";

export function override(
  resources: AmplifyRootStackTemplate,
  amplifyProjectInfo: AmplifyProjectInfo
) {
  // Policy that allows an IAM role to perform the rum:PutEvents action on the CloudWatch RUM API
  const policy = {
    policyName: "cloudwatch-rum-put-events",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          // AWS Region and Account ID (https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)
          // and your Amplify project info are replaced dynamically.
          Resource: {
            "Fn::Sub":
              "arn:aws:rum:${AWS::Region}:${AWS::AccountId}:appmonitor/app-monitor-" +
              `${amplifyProjectInfo.projectName}-${amplifyProjectInfo.envName}`,
          },
          Action: ["rum:PutRumEvents"],
        },
      ],
    },
  };

  // Rename the auth & unauth roles so we can reference them later
  const authRole = resources.authRole;
  authRole.roleName = "amplify-amplifycloudwatchrum-authRole";
  const unauthRole = resources.unauthRole;
  unauthRole.roleName = "amplify-amplifycloudwatchrum-unauthRole";

  // Store the base policies so we can add our own
  const authRoleBasePolicies = Array.isArray(authRole.policies)
    ? authRole.policies
    : [authRole.policies];

  // Give permissions to perform the rum:PutEvents action to the authenticated role
  authRole.policies = [...authRoleBasePolicies, policy];

  // Store the base policies so we can add our own
  const unauthRoleBasePolicies = Array.isArray(unauthRole.policies)
    ? unauthRole.policies
    : [unauthRole.policies];

  // Give permissions to perform the rum:PutEvents action to the unauthenticated role
  unauthRole.policies = [...unauthRoleBasePolicies, policy];
}
