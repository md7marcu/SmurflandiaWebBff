import axios from "axios";
import { config } from "node-config-ts";

// Gate
export default axios.create({
  baseURL: config.settings.gateBase
});
