export type AmplifyDependentResourcesAttributes = {
  "auth": {
    "amplifycloudwatchrumauth": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "custom": {
    "cloudwatchrum": {
      "AppMonitorId": "string",
      "AppMonitorName": "string",
      "GuestRoleArn": "string",
      "IdentityPoolId": "string"
    }
  },
  "function": {
    "cfncustomfn": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  }
}