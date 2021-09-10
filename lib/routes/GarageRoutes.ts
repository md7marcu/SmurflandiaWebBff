import { Response, NextFunction } from "express";
import e = require("express");
import { asyncHandler } from "../middleware/async";
import { IRequest } from "../interfaces/IRequest";
import { isAuthenticated } from "../utils/IsAuthenticated";
import { garageController } from "../controllers/GarageController";
import { exchangeTokenMiddleware } from "../utils/ExchangeToken";
import { IApplication } from "app";
import { Client } from "openid-client";
import * as Debug from "debug";
const debug = Debug("GarageWebApiVNext");

export class GarageRoutes {
    private client: Client;

    public routes(app: IApplication): void {
        this.client = app.client;

        app.get("/garageAlive", isAuthenticated(this.client), exchangeTokenMiddleware(this.client),
        asyncHandler((req: IRequest, res: Response, next: NextFunction) => {
            garageController.alive(req, res, next);
        }));

        app.post("/openRightDoor", isAuthenticated(this.client), exchangeTokenMiddleware(this.client),
        asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await garageController.openRightDoor(req, res, next);
            res.send(message);
        }));

        app.post("/closeRightDoor", isAuthenticated(this.client), exchangeTokenMiddleware(this.client),
        asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await garageController.closeRightDoor(req, res, next);
            res.send(message);
        }));

        app.post("/openLeftDoor", isAuthenticated(this.client), exchangeTokenMiddleware(this.client),
        asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await garageController.openLeftDoor(req, res, next);
            res.send(message);
        }));

        app.post("/closeLeftDoor", isAuthenticated(this.client), exchangeTokenMiddleware(this.client),
        asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await garageController.closeLeftDoor(req, res, next);
            res.send(message);
        }));

        app.post("/moveRightDoor", isAuthenticated(this.client), exchangeTokenMiddleware(this.client),
        asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await garageController.moveRightDoor(req, res, next);
            res.send(message);
        }));

        app.post("/moveLeftDoor", isAuthenticated(this.client), exchangeTokenMiddleware(this.client),
        asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await garageController.moveLeftDoor(req, res, next);
            res.send(message);
        }));
    }
}
export const garageRoutes = new GarageRoutes();
