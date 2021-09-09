import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as https from "https";
import { config } from "node-config-ts";
import Debug from "debug";
import { stateRoutes } from "./routes/StateRoutes";
import MessageBus from "./notifications/MessageBus";
import { serverRoutes } from "./routes/ServerRoutes";
import { garageRoutes } from "./routes/GarageRoutes";
import { gateRoutes } from "./routes/GateRoutes";
import { oidcRoutes } from "./routes/OidcRoutes";
import Db from "./db/db";
import * as mongoose from "mongoose";
import * as connectMongo from "connect-mongodb-session";
import { errorHandler } from "./middleware/error";
const MongoStore = connectMongo(session);
const debug = Debug("GarageWebApiVNext");
import { MongoMemoryServer } from "mongodb-memory-server";
import * as passport from "passport";
import * as fs from "fs";
import { Issuer, Strategy, Client, custom } from "openid-client";
import corsConfig from "./utils/CorsConfig";

export interface IApplication extends express.Application {
    db: Db;
}

const httpsOptions = {
    key: fs.readFileSync("./" + config.settings.appKey),
    cert: fs.readFileSync("./" + config.settings.appCert),
 };

export class App {
    public server: https.Server;
    public db: Db;
    public client: Client;
    private app: IApplication;
    private messageBus: MessageBus;
    private mongoStore: any;
    private mongoUserUrl: string = "" + process.env.MONGODB_URL + process.env.MONGODB_USER_DATABASE;

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
        this.setCACerts();
        this.server = https.createServer(httpsOptions, this.app);
        this.config();
        corsConfig(this.app);
        this.oauth(this.client)
        .catch((error) => {
            debug(`could not setup passport middleware ${error}`);

            throw new Error(error);
        });
        // Passport middleware
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        // this.messageBus = new MessageBus(this.server);

        stateRoutes.routes(this.app, this.messageBus);
        serverRoutes.routes(this.app);
        garageRoutes.routes(this.app);
        gateRoutes.routes(this.app);
        oidcRoutes.routes(this.app);
        this.app.use(errorHandler);

        if (config.settings.useMongo) {
            debug("Using MongoDb.");
            this.mongoSetup(this.mongoUserUrl);
        }
    }

    private async oauth(client: Client) {
        let issuer = await Issuer.discover(config.settings.idp);

        client = new issuer.Client({
            client_id: config.settings.client.client_id,
            client_secret: config.settings.client.client_secret,
            redirect_uris: ["https://localhost:5005/auth/callback"],
            post_logout_redirect_uris: ["https://localhost:3000/logout"],
            token_endpoint_auth_method: "client_secret_post",
            response_types: ["code"],
        });

        passport.serializeUser<any, any>(( user, done) => {
            done(undefined, user);
        });

        passport.deserializeUser((user, done) => {
            done(undefined, user);
        });

        passport.use(
            "oidc",
            new Strategy(
              { client },
              (tokenset, userinfo, done) => {
                console.log("Retrieved tokenset & userinfo");
                // Attach tokens to the stored userinfo.
                userinfo.tokenset = tokenset;
                return done(undefined, userinfo);
              },
            ),
        );
    }
    private setCACerts(): void {
        let cas = [
            fs.readFileSync("./" + config.settings.caCert),
            fs.readFileSync("./" + config.settings.interimCert)];
        https.globalAgent.options.ca = cas;
    }

    private config(): void {
        this.app.use(express.json());

        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        let sess = {
            secret: process.env.COOKIE_SECRET,
            httpOnly: true,
            maxAge: undefined,
            cookie: {
                SameSite: "Strict",
                secure: true,
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
