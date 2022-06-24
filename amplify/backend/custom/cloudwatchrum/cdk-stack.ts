import * as cdk from '@aws-cdk/core';
import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';
import { AmplifyDependentResourcesAttributes } from '../../types/amplify-dependent-resources-ref';
import * as rum from '@aws-cdk/aws-rum';

export class cdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps, amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, 'env', {
      type: 'String',
      description: 'Current Amplify CLI env name',
    });
    /* AWS CDK code goes here - learn more: https://docs.aws.amazon.com/cdk/latest/guide/home.html */
    
    const amplifyProjectInfo = AmplifyHelpers.getProjectInfo();

    // Access other Amplify Resources 
    const retVal: AmplifyDependentResourcesAttributes = AmplifyHelpers.addResourceDependency(this,
      amplifyResourceProps.category,
      amplifyResourceProps.resourceName,
      [
        // Change the name of resourceName below to your Amplify-created resource name
        { category: 'auth', resourceName: 'amplifycloudwatchrumauth' },
        { category: 'function', resourceName: 'cfncustomfn' }
      ]
    );
    // Change the name of resourceName below to your Amplify-created resource name
    const identityPoolId = cdk.Fn.ref(retVal.auth.amplifycloudwatchrumauth.IdentityPoolId);
    const guestRoleArn = `arn:aws:iam::${cdk.Stack.of(this).account}:role/amplify-amplifycloudwatchrum-unauthRole`;
    const myFunctionArn = cdk.Fn.ref(retVal.function.cfncustomfn.Arn);
    
    // Create a CloudWatch RUM appMonitor
    const appMonitor = new rum.CfnAppMonitor(this, `rum-app-monitor-${amplifyProjectInfo.projectName}-${amplifyProjectInfo.envName}`, {
      // Replace this with your app domain if you are using a FQDN
      domain: 'dev.d18c165da8xsyj.amplifyapp.com',
      name: `app-monitor-${amplifyProjectInfo.projectName}-${amplifyProjectInfo.envName}`,

      // the properties below are optional
      appMonitorConfiguration: {
        allowCookies: true,
        enableXRay: true,
        guestRoleArn: guestRoleArn,
        identityPoolId: identityPoolId,
        sessionSampleRate: 1,
        telemetries: ['errors', 'http', 'performance'],
      },
      cwLogEnabled: false
    });

    // Create an AWS Lambda-backed CloudFormation custom resource
    const customResource = new cdk.CustomResource(this, 'MyResource', {
      serviceToken: myFunctionArn,
      properties: {
        envName: amplifyProjectInfo.envName,
        projectName: amplifyProjectInfo.projectName,
      }
    });
    // Add explicit dependency to tell CloudFormation to wait for appMonitor to be created
    customResource.node.addDependency(appMonitor);
    
    // Add outputs so we can retrieve them using Amplify command hooks
    new cdk.CfnOutput(this, 'AppMonitorName', {
      value: `app-monitor-${amplifyProjectInfo.projectName}-${amplifyProjectInfo.envName}`,
    });
    
    new cdk.CfnOutput(this, 'AppMonitorId', {
      value: customResource.getAtt('AppMonitorId').toString(),
    });

    new cdk.CfnOutput(this, 'GuestRoleArn', {
      value: guestRoleArn,
    });

    new cdk.CfnOutput(this, 'IdentityPoolId', {
      value: identityPoolId,
    });
  }
}

