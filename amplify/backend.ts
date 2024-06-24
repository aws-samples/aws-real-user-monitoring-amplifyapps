import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { CloudwatchRum } from "./custom/cfn-custom-cw-rum/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
});

new CloudwatchRum(backend.createStack("cloudWatchRum"), "cloudWatchRum", {
  guestRole: backend.auth.resources.unauthenticatedUserIamRole,
  identityPoolId: backend.auth.resources.cfnResources.cfnIdentityPool.attrId,
  domain: "localhost", // Replace with your domain as needed
});
