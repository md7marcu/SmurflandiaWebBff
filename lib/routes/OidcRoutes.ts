import { Response, Application, NextFunction } from "express";
import { asyncHandler } from "../middleware/async";
import { IRequest } from "../interfaces/IRequest";
import { ErrorResponse } from "../utils/ErrorResponse";
import * as passport from "passport";

export class OidcRoutes {
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

        app.get("/auth/login", async(req: IRequest, res: Response, next: NextFunction) => {
            passport.authenticate("oidc", {
                successRedirect: req.session.returnTo,
                failureRedirect: "/auth/login",
            })(req, res, next);
        });
        //     passport.authenticate("oidc", function (error, user, info) {
        //         console.log(`error: ${JSON.stringify(error)}`);
        //         console.log(`user: ${JSON.stringify(user)}`);
        //         console.log(`info ${JSON.stringify(info)}`);

        //         if (error) {
        //             res.status(401).send(error);
        //         } else if (!user) {
        //             res.status(401).send(info);
        //         } else {
        //             next();
        //         }

        //         res.status(401).send(info);
        //     })(req, res, next);
        // }, function (req, res) {
        //     res.status(200).send("logged in!");
        // });

        app.get("/auth/callback", async(req: IRequest, res: Response, next: NextFunction) => {
            passport.authenticate("oidc", {
                successRedirect: "https://localhost:3000/ops",
                failureRedirect: "/auth/login",
              })(req, res, next);
        });

        app.post("/auth/logout", async(req: IRequest, res: Response, next: NextFunction) => {
            req.logout();
            res.redirect("/");
        });
    }
}
export const oidcRoutes = new OidcRoutes();