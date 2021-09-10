import { Response, NextFunction } from "express";
import * as Debug from "debug";
import { asyncHandler } from "../middleware/async";
import { IRequest } from "../interfaces/IRequest";
import { serverController } from "../controllers/ServerController";
import { ErrorResponse } from "../utils/ErrorResponse";
import { IApplication } from "app";
const debug = Debug("GarageWebApiVNext");

export class ServerRoutes {

    // If the session has expired we need to log on again
    private isAuthenticated = asyncHandler ((req: IRequest, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            return next();
        }
        next(new ErrorResponse("Unauthorized.", 401));
    });

    public routes(app: IApplication): void {
        app.get("/alive", asyncHandler((req: IRequest, res: Response, next: NextFunction) => {
            serverController.alive(req, res);
        }));

        app.get("/userinfo", this.isAuthenticated, asyncHandler((req: IRequest, res: Response, next: NextFunction) => {
            serverController.userInfo(app.client, req, res, next);
        }));
    }
}
export const serverRoutes = new ServerRoutes();