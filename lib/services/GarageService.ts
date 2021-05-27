import { config } from "node-config-ts";
import Debug from "debug";
import { GarageDoor } from "../constants/GarageDoor";
import api from "../utils/GarageApi";
import { ErrorResponse } from "../utils/ErrorResponse";
const debug = Debug("SmurflandiaWebBff:GateController:");

export default class GarageService {
    readonly requestConfig = {
        headers: {
            // tslint:disable-next-line:max-line-length
            "Authorization": "Bearer " + "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRob3JpemUudWx0cmFrb21waXMuY29tIiwiYXVkIjoiYXBpLnVsdHJha29tcGlzLmNvbSIsInN1YiI6ImFAYS5zZSIsImV4cCI6MTYyMjA4OTg1OSwiaWF0IjoxNjIyMDg2MjI5LCJzY29wZSI6Im9wZW5pZCIsImVtYWlsIjoiYUBhLnNlIiwiY2xhaW1zIjpbImdhdGUiLCJnYXJhZ2UiXX0.ddxvnjqXjTDyfb0MB9kW-L-aZsK_AJP64Sst9CTKtRrrHbz8WX5lEiQ7G8bjdQUMJiPVPcCjlAfAQFhurPuwRG-9r5ubTUigWeOxHA8Act-mOQVLjlV-aNUsjLGrsl_hwVRxeCjn-X2xLtbQ9b9vftblCJFFcwZ0ryoibMH6JUhYjxurT4k94TyRI7LHUhdMipVAFhEfrqT1A7sYEZm_GP4QmDVEf6vvvN0DMnvZcypDpZbxYwIFhFSPKjqHDUhnEzi3iEmgWpTK77FTOVa9vDStH4gqEWKAJu7NqT0KHSkIqldBAv7XfI-0Lm6qWz5CCmYzUIayUMam9de5pY1TIA",
        },
    };

    public async getAliveMessage(): Promise<any> {
        return (await api.get(config.settings.garageAlive, this.requestConfig))?.data;
    }

    public async openRightDoor(): Promise<any> {
        return await this.openGarage(GarageDoor.Right);        
    }

    public async closeRightDoor(): Promise<any> {
        return await this.closeGarage(GarageDoor.Right);
    }
    
    public async closeLeftDoor(): Promise<any> {
        return await this.closeGarage(GarageDoor.Left);
    }

    public async openLeftDoor(): Promise<any> {
        return await this.openGarage(GarageDoor.Left);
    }

    public async getGarageState(): Promise<any> {
        try {
            let response = await api.get(config.settings.garageState, this.requestConfig);

            return response?.data;
        } catch (error) {
            debug(`Caught exception while getting gate state: ${error}`);

            return new ErrorResponse(error?.message, 400);
        }
    }

    private async post(uri: string): Promise<any> {
        try {
            let response = await api.post(uri, {}, this.requestConfig);

            return response?.data;
        } catch (error) {
            throw error;
        }
    }

    private async openGarage(which: string): Promise<any> {
        return await this.post(this.getOpenDoor(which));
    }

    private async closeGarage(which: string): Promise<any> {
        return this.post(this.getCloseDoor(which));
    }

    private getOpenDoor(which: string): string {
        return which === GarageDoor.Left ? config.settings.garageLeftOpen : config.settings.garageRightOpen;
    }

    private getCloseDoor(which: string): string {
        return which === GarageDoor.Left ? config.settings.garageLeftClose : config.settings.garageRightClose;
    }
}
export const garageService = new GarageService();