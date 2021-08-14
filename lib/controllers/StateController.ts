import { Response, NextFunction } from "express";
import { IRequest } from "../interfaces/IRequest";
import Debug from "debug";
const debug = Debug("SmurflandiaWebBff:StateController:");
import { garageAuthorized, gateAuthorized, userAuthorized } from "../utils/Authorized";
import { ErrorResponse } from "../utils/ErrorResponse";
import { stateService } from "../services/StateService";
import { gateService } from "../services/GateService";
import { garageService } from "../services/GarageService";

// TODO: Refactor authorization header (will be replaced by token exchange)
export class StateController {

    public async getStates(req: IRequest, res: Response, next: NextFunction) {

        if (userAuthorized(req)) {
            res.send(stateService.getStates(req?.headers?.authorization ?? ""));
        } else {
            return next(new ErrorResponse("Forbidden", 403));
        }
        next();
    }

    public async notify(req: IRequest, res: Response, next: NextFunction) {

        if (userAuthorized(req)) {
            let garageState: string[];
            let gateState: string;

            if (garageAuthorized(req)) {
                garageState = await garageService.getGarageState();
            }
            if (gateAuthorized(req)) {
                gateState = await gateService.getGateState(req?.headers?.authorization ?? "");
            }

            // let state = messageBus.notifyGarage(GarageDoorStatus.Moving, GarageDoor.Left);
            res.send("woohoo");
        } else {
            return next(new ErrorResponse("Forbidden", 403));
        }
        next();
    }
}
export const stateController = new StateController();