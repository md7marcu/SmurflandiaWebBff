import { Response, Application, NextFunction } from "express";
import * as Debug from "debug";
import e = require("express");
import { asyncHandler } from "../middleware/async";
import { IRequest } from "../interfaces/IRequest";
import { garageController } from "../controllers/GarageController";
const debug = Debug("GarageWebApiVNext");
import  "../utils/PassportSetup";
import { ErrorResponse } from "../utils/ErrorResponse";

export class GarageRoutes {

    public routes(app: Application): void {

        app.get("/garageAlive", asyncHandler((req: IRequest, res: Response, next: NextFunction) => {
            garageController.alive(req, res, next);
        }));

        app.post("/openRightDoor", asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await garageController.openRightDoor(req, res, next);
            res.send(message);
        }));

        app.post("/closeRightDoor", asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await garageController.closeRightDoor(req, res, next);
            res.send(message);
        }));

        app.post("/openLeftDoor", asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await garageController.openLeftDoor(req, res, next);
            res.send(message);
        }));

        app.post("/closeLeftDoor", asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
            let message = await garageController.closeLeftDoor(req, res, next);            
            res.send(message);
        }));
    }

    isAuthenticated = asyncHandler ((req: IRequest, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            return next();
        }
        next(new ErrorResponse("Unauthorized.", 401));
    });
}
export const garageRoutes = new GarageRoutes();
