import { Response, Application, NextFunction } from "express";
import * as Debug from "debug";
import e = require("express");
import { asyncHandler } from "../middleware/async";
import { IRequest } from "../interfaces/IRequest";
import { gateController } from "../controllers/GateController";
const debug = Debug("GateRoutes");
import  "../utils/PassportSetup";
import { ErrorResponse } from "../utils/ErrorResponse";
import { isThrowStatement } from "typescript";
import { config} from "node-config-ts";
import api from "../utils/IdpApi";
import { CLIENT_RENEG_WINDOW } from "tls";

export class GateRoutes {

    isAuthenticated = asyncHandler ((req: IRequest, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            return next();
        }
        next(new ErrorResponse("Unauthorized.", 401));
    });

    public routes(app: Application): void {

        app.get("/gateAlive", asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await gateController.alive(req, res, next);
            res.send(message);
        }));

        app.get("/gateProtectedAlive", asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await gateController.protectedAlive(req, res, next);
            res.send(message);
        }));

        app.post("/moveGate", this.exchangeToken, asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await gateController.moveGate(req, res, next);
            res.send(message);
        }));

        app.post("/openGate", asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await gateController.openGate(req, res, next);
            res.send(message);
        }));

        app.post("/closeGate", asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await gateController.closeGate(req, res, next);
            res.send(message);
        }));
    }

    private exchangeToken = async(req: IRequest, res: Response, next: NextFunction) =>  {
        try {
            let response = await api.post(config.settings.accessTokenEndpoint,
                {
                    grant_type: config.settings.tokenExchangeGrant,
                    subject_token_type: config.settings.tokenExchangeSubjectType,
                    subject_token: req?.headers?.authorization?.replace("Bearer ", ""),
                },
                {
                    auth: {
                        username: config.settings.client.client_id,
                        password: config.settings.client.client_secret,
                    },
                },
            );

            req.exchanged_token = response?.data.access_token;
            next();
        } catch (error) {
            debug(`Failed to exchange token ${error}`);
            next(error?.message);
        }
    }
}
export const gateRoutes = new GateRoutes();
