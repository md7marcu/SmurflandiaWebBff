import { Response, Application, NextFunction } from "express";
import * as Debug from "debug";
import e = require("express");
import { asyncHandler } from "../middleware/async";
import { IRequest } from "../interfaces/IRequest";
import { serverController } from "../controllers/ServerController";
const debug = Debug("GarageWebApiVNext");
import  "../utils/PassportSetup";
import { ErrorResponse } from "../utils/ErrorResponse";

export class ServerRoutes {
    private application: any;

    private isAuthenticated = asyncHandler ((req: IRequest, res: Response, next: NextFunction) => {
        console.log(req.isAuthenticated());
        if (req.isAuthenticated()) {
            return next();
        }
        next(new ErrorResponse("Unauthorized.", 401));
    });

    public routes(app: Application): void {
        this.application = app;

        app.get("/alive", asyncHandler((req: IRequest, res: Response, next: NextFunction) => {
            serverController.alive(req, res);
        }));

        app.get("/login", async(req: IRequest, res: Response, next: NextFunction) => {
            serverController.login(req, res, next);
        });

        app.post("/login", async(req: IRequest, res: Response, next: NextFunction) => {
            serverController.login(req, res, next);
        });

        app.post("/logout", async(req: IRequest, res: Response) => {
            serverController.logout(req, res);
        });
    }
}
export const serverRoutes = new ServerRoutes();