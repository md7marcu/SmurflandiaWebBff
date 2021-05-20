import { Request, Response, Application, NextFunction } from "express";
import * as Debug from "debug";
import e = require("express");
import ServerController from "../controllers/ServerController";
import { compare } from "bcryptjs";
import { ErrorResponse } from "../utils/errorResponse";
import { asyncHandler } from "../middleware/async";
const debug = Debug("GarageWebApiVNext");

export interface IRequest extends Request {
    access_token: string;
    session: any;
}

export class ServerRoutes {
    private application: any;

    public routes(app: Application): void {
        this.application = app;
        let serverController = new ServerController();

        app.get("/alive", async(req: IRequest, res: Response) => {
            res.send(serverController.getAliveMessage() + ` ${JSON.stringify(req.session)}`);
        });

        app.post("/login", this.authenticateUser, async(req: IRequest, res: Response, next: NextFunction) => {
            if (req.body.authenticated) {
                res.send("OK!");
            } else {
                return next(new ErrorResponse("unknown user or invalid password.", 401));
            }
        });

        app.post("/logout", async(req: IRequest, res: Response) => {
            // tslint:disable-next-line:no-empty
            req?.session?.destroy((err) => { });
            res.send("logged out.");
        });
    }

    authenticateUser = async(req: IRequest, res: Response, next: NextFunction): Promise<any> => {
        let username = req?.body?.username;
        let user = await this.application.db.getUser(username);
        let password = req?.body?.password ? req?.body?.password : "";

        if (!user || password === "" || !user.enabled) {
            req.body.authenticated = false;
        } else {
            req.body.authenticated = await compare(password, user?.password);
        }
        next();
    }
}