import { config } from "node-config-ts";
import axios from "axios";
import Debug from "debug";
import { GarageDoor } from "../constants/GarageDoor";
const debug = Debug("SmurflandiaWebBff:GateController:");

export default class GarageController {
    readonly requestConfig = {
        headers: {
            // tslint:disable-next-line:max-line-length
            "Authorization": "Bearer " + "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRob3JpemUudWx0cmFrb21waXMuY29tIiwiYXVkIjoiYXBpLnVsdHJha29tcGlzLmNvbSIsInN1YiI6InVsdHJha29tcGlzIiwiZXhwIjoxNjEzODI5ODUxLCJpYXQiOjE2MTM4MjYyMjEsInNjb3BlIjoib3BlbmlkIiwiZW1haWwiOiJhQGEuc2UiLCJjbGFpbXMiOlsiZ2F0ZSIsImdhcmFnZSJdfQ.egqk8pmLyOyBGILuEGQtNO53hmonNutDx6zMzD48rlmprihfz4XT13IkCw4HxxCKoHmwqXbcgiglZ3lVfeI3wKGzD86WsRIGH20L2Y9xTwFsbuPAvj1ETFt-fW4eTCzc47NOdA3o5ZJg4V5ALdHiopmep4UHLCTDEroILLcHBkfIJN5OE85ahRYQphKndMyMiMCI2owXTqE4N25ct8DbwMlu6a8CKL-h6vHwJFd6mTfD6UXqWkwnjKJe_daYWxu1L3_FH2xi0-JiZjQzBLL4GF0sV0vVesD20Cfheo85YYqSVtjhIdE2ruIBHdfa9BbMCD6j-1uz8rEvR7U6dpAeZg",
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

    public async getGarageState(): Promise<Array<String>> {
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