import axios from "axios";
import { config } from "node-config-ts";
import * as https from "https";
// Gate
/**
 * Disable only in development mode
 */
if (process.env.NODE_ENV === "Development" || process.env.NODE_ENV === "Windows") {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    // For Issuer.Discover (passport)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    axios.defaults.httpsAgent = httpsAgent;
    // eslint-disable-next-line no-console
    console.log(process.env.NODE_ENV, `RejectUnauthorized is disabled.`);
}

export default axios.create({
  baseURL: config.settings.gateBase,
});
