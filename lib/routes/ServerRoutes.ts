import { Request, Response, Application, NextFunction } from "express";
import * as Debug from "debug";
import e = require("express");
import { compare } from "bcryptjs";
import { ErrorResponse } from "../utils/ErrorResponse";
import { asyncHandler } from "../middleware/async";
import { IRequest } from "../interfaces/IRequest";
import { serverController } from "controllers/ServerController";
const debug = Debug("GarageWebApiVNext");

export class ServerRoutes {
    private application: any;

    public routes(app: Application): void {
        this.application = app;

        app.get("/alive", async(req: IRequest, res: Response) => {
            serverController.alive(req, res);
        });

        app.post("/login", this.authenticateUser, async(req: IRequest, res: Response, next: NextFunction) => {
            serverController.login(req, res, next);
        });

        app.post("/logout", async(req: IRequest, res: Response) => {
            serverController.logout(req, res);
        });
    }

    authenticateUser = asyncHandler(async (req: IRequest, res: Response, next: NextFunction): Promise<any> => {
        let username = req?.body?.username;
        let user = await this.application.db.getUser(username);
        let password = req?.body?.password ? req?.body?.password : "";

        if (!user || password === "" || !user.enabled) {
            req.body.authenticated = false;
        } else {
            req.body.authenticated = await compare(password, user?.password);
        }
        next();
    });
}