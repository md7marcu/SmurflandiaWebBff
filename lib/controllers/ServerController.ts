import { Response, NextFunction } from "express";
import { IRequest } from "../interfaces/IRequest";
import Debug from "debug";
import { ErrorResponse } from "../utils/ErrorResponse";
import { serverService } from "../services/ServerService";
const debug = Debug("SmurflandiaWebBff:StateController:");
import * as passport from "passport";
import { decode } from "jsonwebtoken";
import { exchangeToken } from "../utils/ExchangeToken";

export class ServerController {

    public async userInfo(req: IRequest, res: Response, next: NextFunction) {
        let userInfo = await serverService.getUserInfo(req?.user?.tokenset?.access_token);
        let accessToken = await exchangeToken(req?.user?.tokenset?.id_token);
        let decodedToken = decode(accessToken);
        let user = {
            ...userInfo,
            claims: [...decodedToken?.scope],
        };
        res.send(user);
    }

    public async alive(req: IRequest, res: Response) {
        res.send(serverService.getAliveMessage());
    }

    public async login(req: IRequest, res: Response, next: NextFunction) {
        passport.authenticate("local", function(err, user, info) {
            if (err) {
                next(new ErrorResponse("unknown error", 500));
                return;
            }
            if (!user) {
                next(new ErrorResponse("unknown user or invalid password.", 401));
                return;
            }
            req.logIn(user, function(loginErr) {
                if (loginErr) {
                    next(new ErrorResponse("unknown user or invalid password.", 401));
                    return;
                }
                return res.status(200).send(req.session.cookie);
            });
        })(req, res, next);
    }

    public async logout(req: IRequest, res: Response) {
        // tslint:disable-next-line:no-empty
        req?.session?.destroy((err) => { });
        res.send("logged out.");
    }
}
export const serverController = new ServerController();