import { Request, Response, Application, NextFunction } from "express";
import * as Debug from "debug";
import e = require("express");
import { compare } from "bcryptjs";
import { asyncHandler } from "../middleware/async";
import { IRequest } from "../interfaces/IRequest";
import { serverController } from "../controllers/ServerController";
import * as passport from "passport";
const debug = Debug("GarageWebApiVNext");
// Import passport configuration - "local"
import  "../utils/PassportSetup";

export class ServerRoutes {
    private application: any;

    public routes(app: Application): void {
        this.application = app;

        app.get("/alive", this.isAuthenticated, asyncHandler((req: IRequest, res: Response, next: NextFunction) => {
            serverController.alive(req, res);
        }));

        // app.post("/login", this.authenticateUser, async(req: IRequest, res: Response, next: NextFunction) => {
        //     serverController.login(req, res, next);
        // });

        app.post("/logout", async(req: IRequest, res: Response) => {
            serverController.logout(req, res);
        });

        app.post("/login", async(req: IRequest, res: Response, next: NextFunction) => {
            passport.authenticate("local", function(err, user, info) {
                if (err) {
                    return res.status(400).json({ errors: err });
                }
                if (!user) {
                    return res.status(400).json({ errors: "Unknown user." });
                }
                req.logIn(user, function(err) {
                    if (err) {
                        return res.status(401).json({ errors: err });
                    }
                    return res.status(200).send(req.session);
                });
            })(req, res, next);
        });
    }

    isAuthenticated = async (req: IRequest, res: Response, next: NextFunction) => {

        console.log(req.isAuthenticated());
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    };

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