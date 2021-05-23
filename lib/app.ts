import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as http from "http";
import { config } from "node-config-ts";
import Debug from "debug";
import { StateRoutes } from "./routes/StateRoutes";
import MessageBus from "./notifications/MessageBus";
import { ServerRoutes } from "./routes/ServerRoutes";
import Db from "./db/db";
import * as mongoose from "mongoose";
import * as connectMongo from "connect-mongodb-session";
import { errorHandler } from "./middleware/error";
import * as fs from "fs";
const MongoStore = connectMongo(session);
const debug = Debug("GarageWebApiVNext");
import { MongoMemoryServer } from "mongodb-memory-server";
import * as cors from "cors";

export interface IApplication extends express.Application {
    db: Db;
}

export class App {
    public server: http.Server;
    public db: Db;
    private app: IApplication;
    private stateRoutes: StateRoutes = new StateRoutes();
    private serverRoutes: ServerRoutes = new ServerRoutes();
    private messageBus: MessageBus;
    private mongoStore: any;
    private mongoUserUrl: string = "" + process.env.MONGODB_URL + process.env.MONGODB_USER_DATABASE;
    private httpsOptions = {
       // key: fs.readFileSync("./config/bffKey.pem"),
       // cert: fs.readFileSync("./config/bffCert.pem"),
    };

    constructor() {
        debug("Constructing app.");
        this.mongoStore = new MongoStore({
            uri: "" + process.env.MONGODB_URL + process.env.MONGODB_SMURF_DATABASE,
            collection: process.env.SESSIONS_COLLECTION,
        });
        this.mongoStore.on("error", function(error) {
            debug(error);

            return;
        });

        (this.app as any) = express();
        this.app.db = new Db();
        this.server = http.createServer(this.app);
        this.config();
        this.corsConfig();
        this.messageBus = new MessageBus(this.server);

        this.stateRoutes.routes(this.app, this.messageBus);
        this.serverRoutes.routes(this.app);
        this.app.use(errorHandler);

        if (config.settings.useMongo) {
            debug("Using MongoDb.");
            this.mongoSetup(this.mongoUserUrl);
        }
    }

    private config(): void {
        // support application/json type post data
        // TODO: Verify it works with exress.json
        // this.app.use(bodyParser.json());
        this.app.use(express.json());

        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        let sess = {
            secret: process.env.COOKIE_SECRET,
            httpOnly: true,
            maxAge: undefined,
            cookie: {
                SameSite: "Strict",
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 * 14, // 2 weeks
            },
            store: this.mongoStore,
            resave: true,
            saveUnitialized: true,
        };

        if (process.env.NODE_ENV === "prod") {
            sess.cookie.secure = true;
        }
        this.app.use(session(sess));

        // this.app.use(express.static("public"));
    }

    private corsConfig = () => {
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
        this.app.use(cors(corsOptions));
    }

    private mongoSetup = (connectionString: string): void => {

        if (false) {
            const mongoServer = new MongoMemoryServer();
            mongoServer.getUri().then((mongoUri) => {
              const mongooseOpts = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
              };
              mongoose.set("useFindAndModify", false);
              mongoose.connect(mongoUri, mongooseOpts);

              mongoose.connection.on("error", (e) => {
                if (e.message.code === "ETIMEDOUT") {
                  console.log(e);
                  mongoose.connect(mongoUri, mongooseOpts);
                }
                console.log(e);
              });

              mongoose.connection.once("open", () => {
                console.log(`MongoDB successfully connected to ${mongoUri}`);
              });
            });
        } else {
            // Use the MongoDB drivers upsert method instead of mongooses
            mongoose.set("useFindAndModify", false);
            mongoose.connect(connectionString, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
            }).
            catch(error =>
                debug(`Unable to connect to mongodb, error: ${error}`),
            );
        }
        mongoose.connection.once("open", () => {
            debug(`Connected to MongoDB`);
        });
        mongoose.connection.on("error", (error) => {
            debug(`Unable to connect to mongodb, error ${error}`);
        });
    }
}
export default new App().server;
