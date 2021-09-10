import { Response, NextFunction } from "express";
import e = require("express");
import { asyncHandler } from "../middleware/async";
import { IRequest } from "../interfaces/IRequest";
import { gateController } from "../controllers/GateController";
import * as Debug from "debug";
const debug = Debug("GateRoutes");
import { exchangeTokenMiddleware } from "../utils/ExchangeToken";
import { Client } from "openid-client";
import { IApplication } from "app";
import isAuthenticated from "../utils/IsAuthenticated";

export class GateRoutes {
    private client: Client;

    public routes(app: IApplication): void {
        this.client = app.client;

        app.get("/gateAlive", asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await gateController.alive(req, res, next);
            res.send(message);
        }));

        app.get("/gateProtectedAlive", isAuthenticated(this.client), asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await gateController.protectedAlive(req, res, next);
            res.send(message);
        }));

        app.post("/moveGate", isAuthenticated(this.client), exchangeTokenMiddleware(this.client),
        asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await gateController.moveGate(req, res, next);
            res.send(message);
        }));

        app.post("/openGate", isAuthenticated(this.client), exchangeTokenMiddleware(this.client),
        asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await gateController.openGate(req, res, next);
            res.send(message);
        }));

        app.post("/closeGate", isAuthenticated(this.client), exchangeTokenMiddleware(this.client),
        asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await gateController.closeGate(req, res, next);
            res.send(message);
        }));
    }
}
export const gateRoutes = new GateRoutes();
