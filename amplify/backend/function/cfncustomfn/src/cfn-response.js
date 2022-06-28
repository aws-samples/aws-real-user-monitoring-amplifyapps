var https = require("https");
var url = require("url");

exports.SUCCESS = "SUCCESS";
exports.FAILED = "FAILED";

exports.send = async (
  event,
  context,
  responseStatus,
  responseData,
  physicalResourceId,
  noEcho
) => {
  var responseBody = JSON.stringify({
    Status: responseStatus,
    Reason:
      "See the details in CloudWatch Log Stream: " + context.logStreamName,
    PhysicalResourceId: physicalResourceId || context.logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: noEcho || false,
    Data: responseData,
  });

  var parsedUrl = new url.URL(event.ResponseURL);
  var options = {
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
    var request = https.request(options, function (response) {
      resolve(response);
    });

    request.on("error", function (error) {
      reject(error);
    });

    request.write(responseBody);
    request.end();
  });
};
