import { Response, Application, NextFunction } from "express";
import { IRequest } from "../interfaces/IRequest";
import * as passport from "passport";

export class OidcRoutes {
    public routes(app: Application): void {
        app.get("/auth/login", async(req: IRequest, res: Response, next: NextFunction) => {
            passport.authenticate("oidc", {
                successRedirect: req.session.returnTo,
                failureRedirect: "/auth/login",
            })(req, res, next);
        });

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