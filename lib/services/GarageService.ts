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
            "Authorization": "Bearer " + "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRob3JpemUudWx0cmFrb21waXMuY29tIiwiYXVkIjoiYXBpLnVsdHJha29tcGlzLmNvbSIsInN1YiI6ImFAYS5zZSIsImV4cCI6MTYyMjE3NTMzNCwiaWF0IjoxNjIyMTcxNzA0LCJzY29wZSI6Im9wZW5pZCIsImVtYWlsIjoiYUBhLnNlIiwiY2xhaW1zIjpbImdhdGUiLCJnYXJhZ2UiXX0.i-aM-yIMAS5r65NvzpoBo9iBZTCDfDpfn4-7HB9cfaB_dV3GyCuFaWSHp-iMxPUjuquoAKR9EHPHW1Fvix6itnWWFq_Do8VkN6UgOwXavBLq-B65ruaRWrNNkBX1YGHlT7-cnMuMh1LAQtoq3wIKfsNCq31sWwCq6F47gxnKUMtkRv5Z2fS1lzryuEAjJd6zy7kD65gu8TRZ9KKySyDAEJ3ovwSlVQgAJ69wcFCxsBpRy1u36_4oScqFduNi8htAwpXniIakdkd615aJ2FV-a6s6oCFbNpAD1846bG8EknpYwhTRmk6lU7Ln88Zm3ORyXCVWjCH_YylC2W5ZABpG7w",
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

    public async moveRightDoor(): Promise<any> {
        return await this.moveGarage(GarageDoor.Right);
    }

    public async moveLeftDoor(): Promise<any> {
        return await this.moveGarage(GarageDoor.Left);
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

    // TODO: close door - will just trigger it to move - cleanup/state
    private async moveGarage(which: string): Promise<any> {
        return await this.post(this.getCloseDoor(which));
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