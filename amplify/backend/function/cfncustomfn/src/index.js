const { Logger } = require("@aws-lambda-powertools/logger");
const response = require("./cfn-response");
const { RUM } = require("aws-sdk");

const MAX_RETRIES = 5;

const logger = new Logger({
  serviceName: "appMonitorIdRetrieveService",
  logLevel: "DEBUG",
});
const client = new RUM();

/**
 * @type {import('@types/aws-lambda').CloudFormationCustomResourceHandler}
 */
exports.handler = async (event, context) => {
  logger.debug("Event:", { event: event });

  if (event.RequestType === "Delete") {
    logger.info("Delete");
    await response.send(event, context, response.SUCCESS, {}, "CustomFunction");
  } else if (event.RequestType === "Create" || event.RequestType === "Update") {
    logger.info("Create/Update");

    if (
      !event.ResourceProperties.hasOwnProperty("projectName") ||
      !event.ResourceProperties.hasOwnProperty("envName")
    ) {
      logger.error("Event not supported, no projectName or envName", {
        details: event,
      });
      await response.send(
        event,
        context,
        response.FAILED,
        {},
        "CustomFunction"
      );
    }

    let retryIdx = 1;
    let appMonitorId;
    while (!appMonitorId) {
      if (retryIdx === MAX_RETRIES) {
        logger.error("Reached max retry limit, appMonitor not found.");
        await response.send(
          event,
          context,
          response.FAILED,
          {},
          "CustomFunction"
        );
      }

      try {
        const { projectName, envName } = event.ResourceProperties;
        const res = await client
          .getAppMonitor({
            Name: `app-monitor-${projectName}-${envName}`,
          })
          .promise();
        appMonitorId = res.AppMonitor.Id;
      } catch (err) {
        logger.error(err);
        const waitMs = 1000 * retryIdx;
        logger.info(`Trying again in ${waitMs}ms`);
        retryIdx++;
        // Basic back-off mechanism
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }

    try {
      const responseData = { AppMonitorId: appMonitorId };
      logger.debug("Response data", { details: responseData });
      await response.send(
        event,
        context,
        response.SUCCESS,
        responseData,
        "CustomFunction"
      );
    } catch (err) {
      logger.error(err);
      await response.send(
        event,
        context,
        response.FAILED,
        {},
        "CustomFunction"
      );
    }
  } else {
    logger.error("Event not supported", { details: event });
    await response.send(event, context, response.FAILED, {}, "CustomFunction");
  }
};
