import { NextFunction, Response } from "express";
import { IRequest } from "../interfaces/IRequest";
import Debug from "debug";
import { garageService } from "../services/GarageService";
const debug = Debug("SmurflandiaWebBff:GarageController:");

export class GarageController {
    public async alive(req: IRequest, res: Response, next: NextFunction) {
        try {
            let message = await garageService.getAliveMessage();
            res.send(message);
        } catch (error) {
            next(error);
        }
    }
    //TODO: protect
    public async openRightDoor(req: IRequest, res: Response, next: NextFunction): Promise<any> {
        return await garageService.openRightDoor();
    }
    //TODO: protect
    public async closeRightDoor(req: IRequest, res: Response, next: NextFunction): Promise<any> {
        return await garageService.closeRightDoor();
    }
    //TODO: protect
    public async openLeftDoor(req: IRequest, res: Response, next: NextFunction): Promise<any> {
        return await garageService.openLeftDoor();
    }
    //TODO: protect
    public async closeLeftDoor(req: IRequest, res: Response, next: NextFunction): Promise<any> {
        return await garageService.closeLeftDoor();
    }
    //TODO: protect
    public async moveRightDoor(req: IRequest, res: Response, next: NextFunction): Promise<any> {
        return await garageService.moveRightDoor();
    }
    //TODO: protect
    public async moveLeftDoor(req: IRequest, res: Response, next: NextFunction): Promise<any> {
        return await garageService.moveLeftDoor();
    }
}
export const garageController = new GarageController();
