export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "amplifycloudwatchrumauth": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "function": {
        "cfncustomfn": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "custom": {
        "cloudwatchrum": {
            "AppMonitorName": "string",
            "AppMonitorId": "string",
            "GuestRoleArn": "string",
            "IdentityPoolId": "string"
        }
    }
}