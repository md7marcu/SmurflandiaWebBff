import { Response, NextFunction } from "express";
import { IRequest } from "../interfaces/IRequest";
import Debug from "debug";
import { ErrorResponse } from "../utils/ErrorResponse";
import { serverService } from "../services/ServerService";
const debug = Debug("SmurflandiaWebBff:StateController:");

export class ServerController {

    public async alive(req: IRequest, res: Response) {
        res.send(serverService.getAliveMessage() + ` ${JSON.stringify(req.session)}`);
    }

    public async login(req: IRequest, res: Response, next: NextFunction) {
        if (req.body.authenticated) {
            res.send("OK!");
        } else {
            return next(new ErrorResponse("unknown user or invalid password.", 401));
        }
    }

    public async logout(req: IRequest, res: Response) {
        // tslint:disable-next-line:no-empty
        req?.session?.destroy((err) => { });
        res.send("logged out.");
    }
}
export const serverController = new ServerController();