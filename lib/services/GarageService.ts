import { config } from "node-config-ts";
import axios from "axios";
import Debug from "debug";
import { GarageDoor } from "../constants/GarageDoor";
const debug = Debug("SmurflandiaWebBff:GateController:");

export default class GarageService {
    readonly requestConfig = {
        headers: {
            // tslint:disable-next-line:max-line-length
            "Authorization": "Bearer " + "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRob3JpemUudWx0cmFrb21waXMuY29tIiwiYXVkIjoiYXBpLnVsdHJha29tcGlzLmNvbSIsInN1YiI6ImFAYS5zZSIsImV4cCI6MTYyMTY5NjQ0NiwiaWF0IjoxNjIxNjkyODE2LCJzY29wZSI6Im9wZW5pZCIsImVtYWlsIjoiYUBhLnNlIiwiY2xhaW1zIjpbImdhdGUiLCJnYXJhZ2UiXX0.OCXh6HWoE89rOOZ28j2RbDkemH8CLRM2j5xSrv7MDSTxB37u8OKsRMVErRQVMW1tyvJARzgfHvTZd39tIbMdvy0RpEYP2CM5z9OF-GTHSJtzDrbArf4oeZ8Uf9d3cq4lnpfyYoF7Z8ANeIVY5QzqKZ1vnvprukCRVwKJbabpuvNB-6TuPpr30d1ZWlHRdtDVN8iRCM22d9Jtbd-NmIwmVjXMIlgpy0aAniFcXhaZJFFhSxgka2LKxq3r2Ij_nOuXgLQrhklNQRKy_dwUM6S6IrKIE5KKb2LpZSuyBGP7pimgUwL5TuknFsVI06uM2Gu-d5Gk9RmFv-vr6WkkfoaSwQ",
        },
    };

    public async openLeftDoor(): Promise<any> {
        return await this.openGarage(GarageDoor.Left);
    }

    public async openRightDoor(): Promise<any> {
        return await this.openGarage(GarageDoor.Right);
    }

    public async closeLeftDoor(): Promise<any> {
        return await this.closeGarage(GarageDoor.Left);
    }

    public async closeRightDoor(): Promise<any> {
        return await this.closeGarage(GarageDoor.Right);
    }

    public async moveLeftDoor(): Promise<any> {
        return await this.moveGarage(GarageDoor.Left);
    }

    public async moveRightDoor(): Promise<any> {
        return await this.moveGarage(GarageDoor.Right);
    }

    public async getGarageState(): Promise<Array<string>> {
        try {
            let response = await axios.get(
                config.settings.garageBase + config.settings.garageState,
                this.requestConfig);

            return response?.data;
        } catch (error) {
            debug(`Caught exception while getting gate state: ${error}`);

            return [error];
        }
    }

    private async post(uri: string): Promise<any> {
        try {
            let response = await axios.post(uri, this.requestConfig);

            return response;
        } catch (error) {
            debug(`Caught exception while operating garage at: ${uri}`);

            return undefined;
        }
    }

    private async openGarage(which: string): Promise<any> {
        return await this.post(config.settings.garageBase + this.getOpenDoor(which));
    }

    private async closeGarage(which: string): Promise<any> {
        return this.post(config.settings.garageBase +  this.getCloseDoor(which));
    }

    private async moveGarage(which: string): Promise<any> {
        return this.post(config.settings.garageBase +  this.getMoveDoor(which));
    }

    private getOpenDoor(which: string): string {
        return which === GarageDoor.Left ? config.settings.garageLeftOpen : config.settings.garageRightOpen;
    }

    private getCloseDoor(which: string): string {
        return which === GarageDoor.Left ? config.settings.garageLeftClose : config.settings.garageRightClose;
    }

    private getMoveDoor(which: string): string {
        return which === GarageDoor.Left ? config.settings.garageLeftMove : config.settings.garageRightMove;
    }
}
export const garageService = new GarageService();