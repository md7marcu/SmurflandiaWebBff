import { NextFunction, Response } from "express";
import { IRequest } from "../interfaces/IRequest";
import Debug from "debug";
import { gateService } from "../services/GateService";
const debug = Debug("SmurflandiaWebBff:GateController:");

export class GateController {
    public async alive(req: IRequest, res: Response, next: NextFunction) {
        return await gateService.getAliveMessage();
    }

    public async protectedAlive(req: IRequest, res: Response, next: NextFunction) {
        return await gateService.getProtectedAliveMessage();
    }

    //TODO: protect
    public async openGate(req: IRequest, res: Response, next: NextFunction): Promise<any> {
        return await gateService.openGate();
    }
    //TODO: protect
    public async closeGate(req: IRequest, res: Response, next: NextFunction): Promise<any> {
        return await gateService.closeGate();
    }
//TODO: protect
        public async moveGate(req: IRequest, res: Response, next: NextFunction): Promise<any> {
            return await gateService.moveGate();
        }

}
export const gateController = new GateController();
