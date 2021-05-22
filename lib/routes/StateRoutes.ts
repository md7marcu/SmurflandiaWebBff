import { Request, Response, NextFunction, Application } from "express";
import { IRequest } from "../interfaces/IRequest";
import * as Fs from "fs";
import { VerifyOptions, verify } from "jsonwebtoken";
import { pki }from "node-forge";
import * as Debug from "debug";
import * as path from "path";
import MessageBus from "../notifications/MessageBus";
import e = require("express");
import { ErrorResponse } from "../utils/ErrorResponse";
import { asyncHandler } from "middleware/async";
import { config } from "node-config-ts";
import { garageAuthorized, gateAuthorized, userAuthorized } from "../utils/Authorized";
import { stateController } from "../controllers/StateController";

const debug = Debug("GarageWebApiVNext");

export class StateRoutes {
    private AUTH_HEADER = "authorization";

    public routes(app: Application, messageBus: MessageBus): void {

        // TODO: cleanup => Implement notify
        app.post("/Notify", this.retrieveAccessToken, this.requireAccessToken, async(req: IRequest, res: Response, next: NextFunction) => {
            stateController.Notify(req, res, next);
        });

        app.post("/GetStates", this.retrieveAccessToken, this.requireAccessToken, async (req: IRequest, res: Response, next: NextFunction) => {
            stateController.GetStates(req, res, next);
        });
    }

    private retrieveAccessToken = (req: IRequest, res: Response, next: NextFunction) => {
        // get the auth servers public key
        let serverCert = Fs.readFileSync(path.join(process.cwd(), config.settings.serverCert)).toString();
        let publicKey = pki.publicKeyToPem(pki.certificateFromPem(serverCert).publicKey);
        let accessToken = this.getAccessToken(req);

        debug(`Server public key: ${JSON.stringify(publicKey)}`);

        // Verify access token
        let decodedToken;
        try {
            let options = this.getVerifyOptions();
            decodedToken = verify(accessToken, publicKey, options);
        } catch (err) {
            debug(`Verifying accessToken failed: ${err.message}`);
            return next(new ErrorResponse(err.message, 401));
        }

        if (decodedToken) {
            debug(`AccessToken signature valid. ${decodedToken}`);
            req.access_token = decodedToken;
        }
        next();
    }

    // If access_token doesn't exist on request, we couldn't verify it => return Unauthorized
    private requireAccessToken = (req: IRequest, res: Response, next: NextFunction) => {

        if (!req.access_token) {
            return next(new ErrorResponse("Unauthorized", 401));
        }
        next();
    }

    // Get the access token from the request
    // It should be in the header (bearer: "....")
    // It might be in the body or in the query
    // It shouldn't be, but it might
    private getAccessToken = (req: Request): string => {
        let authHeader = req.headers[this.AUTH_HEADER];
        let token: string = "";

        if (authHeader && authHeader.toString().toLowerCase().indexOf("bearer") === 0) {
            debug(`Found token in header.`);
            token = authHeader.slice("bearer ".length).toString();
        } else if (req.body && req.body.access_token) {
            debug(`Found token in body.`);
            token = req.body.access_token.toString();
        } else if (req.query && req.query.access_token) {
            debug(`Found token in header.`);
            token = req.query.access_token.toString();
        }
        debug(`Token: ${token}`);

        return token;
    }

    // Decide what to verify in the token
    private getVerifyOptions = () => {
        let verifyOptions: VerifyOptions = {};

        verifyOptions.issuer = config.settings.issuer;
        verifyOptions.audience = config.settings.audience;
        verifyOptions.ignoreNotBefore = true;
        verifyOptions.ignoreExpiration = true;
        verifyOptions.algorithms = [config.settings.algorithm];

        return verifyOptions;
    }
}