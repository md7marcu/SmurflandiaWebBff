import { Response, Application, NextFunction } from "express";
import * as Debug from "debug";
import e = require("express");
import { asyncHandler } from "../middleware/async";
import { IRequest } from "../interfaces/IRequest";
import { gateController } from "../controllers/GateController";
const debug = Debug("GateRoutes");
import  "../utils/PassportSetup";
import { ErrorResponse } from "../utils/ErrorResponse";

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

        app.post("/moveGate", asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
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
}
export const gateRoutes = new GateRoutes();
