import { Response, Application, NextFunction } from "express";
import * as Debug from "debug";
import { asyncHandler } from "../middleware/async";
import { IRequest } from "../interfaces/IRequest";
import { serverController } from "../controllers/ServerController";
import { ErrorResponse } from "../utils/ErrorResponse";
const debug = Debug("GarageWebApiVNext");

export class ServerRoutes {

    private isAuthenticated = asyncHandler ((req: IRequest, res: Response, next: NextFunction) => {
        console.log(req.isAuthenticated());
        if (req.isAuthenticated()) {
            return next();
        }
        next(new ErrorResponse("Unauthorized.", 401));
    });

    public routes(app: Application): void {
        app.get("/alive", asyncHandler((req: IRequest, res: Response, next: NextFunction) => {
            serverController.alive(req, res);
        }));

        app.get("/userinfo", this.isAuthenticated, asyncHandler((req: IRequest, res: Response, next: NextFunction) => {
            serverController.userInfo(req, res, next);
        }));
    }
}
export const serverRoutes = new ServerRoutes();