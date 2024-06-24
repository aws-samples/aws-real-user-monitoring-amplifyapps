import type { CloudFormationCustomResourceHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { RUMClient, GetAppMonitorCommand } from "@aws-sdk/client-rum";
import { send, SUCCESS, FAILED } from "./cfn-response";

const MAX_RETRIES = 5;

const logger = new Logger({
  serviceName: "appMonitorIdRetrieveService",
  logLevel: "DEBUG",
});
const client = new RUMClient();

export const handler: CloudFormationCustomResourceHandler = async (event, context) => {
  logger.addContext(context);
  logger.debug("event", { event });

  const { RequestType: requestType, ResourceProperties: properties } = event;

  if (requestType === "Delete") {
    logger.info("Delete");
    await send(event, context, SUCCESS, {}, "CustomFunction");
  } else if (requestType === "Create" || requestType === "Update") {
    logger.info("Create/Update");

    const { appMonitorName } = properties;

    if (appMonitorName === undefined) {
      logger.error("Event not supported, no appMonitorName", {
        details: event,
      });
      await send(event, context, FAILED, {}, "CustomFunction");
    }

    let retryIdx = 1;
    let appMonitorId: string | undefined = undefined;
    while (appMonitorId === undefined) {
      if (retryIdx === MAX_RETRIES) {
        logger.error("Reached max retry limit, appMonitor not found.");
        await send(event, context, FAILED, {}, "CustomFunction");
      }

      try {
        const res = await client.send(
          new GetAppMonitorCommand({
            Name: appMonitorName,
          }),
        );
        appMonitorId = res?.AppMonitor?.Id;
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
      await send(event, context, SUCCESS, responseData, "CustomFunction");
    } catch (err) {
      logger.error(err);
      await send(event, context, FAILED, {}, "CustomFunction");
    }
  } else {
    logger.error("Event not supported", { details: event });
    await send(event, context, FAILED, {}, "CustomFunction");
  }
};
