import type { CloudFormationCustomResourceEvent, Context } from "aws-lambda";
import https from "node:https";
import url from "node:url";

const SUCCESS = "SUCCESS";
const FAILED = "FAILED";

const send = async (
  event: CloudFormationCustomResourceEvent,
  context: Context,
  responseStatus: string,
  responseData: Record<string, unknown>,
  physicalResourceId: string,
  noEcho?: boolean,
) => {
  const responseBody = JSON.stringify({
    Status: responseStatus,
    Reason: `See the details in CloudWatch Log Stream: ${context.logStreamName}`,
    PhysicalResourceId: physicalResourceId || context.logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: noEcho || false,
    Data: responseData,
  });

  const parsedUrl = new url.URL(event.ResponseURL);
  const options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: `${parsedUrl.pathname}${parsedUrl.search}`,
    method: "PUT",
    headers: {
      "content-type": "",
      "content-length": responseBody.length,
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      resolve(response);
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.write(responseBody);
    request.end();
  });
};

export { send, SUCCESS, FAILED };
