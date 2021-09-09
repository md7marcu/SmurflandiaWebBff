import { config } from "node-config-ts";
import * as cors from "cors";
import { IApplication } from "app";

const corsConfig = (app: IApplication) => {
    const whitelist = config.settings.corsWhitelist;
    const corsOptions = {
      origin: function (origin, callback) {
        // origin is undefined server - server
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(undefined, true);
        } else {
          callback(new Error("Cors error."));
        }
      },
    };
    // Need to allow credentials through CORS
    app.use(function(req, res, next) {
        res.set("Access-Control-Allow-Credentials", "true");
        next();
    });
    app.use(cors(corsOptions));
};

export default corsConfig;