import { NextFunction, Response } from "express";
import { IRequest } from "../interfaces/IRequest";
import Debug from "debug";
import { gateService } from "../services/GateService";
const debug = Debug("SmurflandiaWebBff:GateController:");

// TODO: Refactor authorization header (will be replaced by token exchange)
export class GateController {
    public async alive(req: IRequest, res: Response, next: NextFunction) {
        return await gateService.getAliveMessage();
    }

    public async protectedAlive(req: IRequest, res: Response, next: NextFunction) {
        return await gateService.getProtectedAliveMessage(req?.headers?.authorization ?? "");
    }

    public async openGate(req: IRequest, res: Response, next: NextFunction): Promise<any> {
        return await gateService.openGate(req?.headers?.authorization ?? "");
    }

    public async closeGate(req: IRequest, res: Response, next: NextFunction): Promise<any> {
        return await gateService.closeGate(req?.headers?.authorization ?? "");
    }

    public async moveGate(req: IRequest, res: Response, next: NextFunction): Promise<any> {
        return await gateService.moveGate(req?.headers?.authorization ?? "");
    }

}
export const gateController = new GateController();
