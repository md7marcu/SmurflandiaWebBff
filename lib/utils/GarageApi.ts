import axios from "axios";
import { config } from "node-config-ts";

// Garage
export default axios.create({
  baseURL: config.settings.garageBase
});
