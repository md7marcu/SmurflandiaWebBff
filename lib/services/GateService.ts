import { config } from "node-config-ts";
import axios from "axios";
import Debug from "debug";
const debug = Debug("SmurflandiaWebBff:GateController:");

export default class GateService {
    readonly requestConfig = {
        headers: {
            // tslint:disable-next-line:max-line-length
            "Authorization": "Bearer " + "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRob3JpemUudWx0cmFrb21waXMuY29tIiwiYXVkIjoiYXBpLnVsdHJha29tcGlzLmNvbSIsInN1YiI6ImFAYS5zZSIsImV4cCI6MTYyMTY5NjQ0NiwiaWF0IjoxNjIxNjkyODE2LCJzY29wZSI6Im9wZW5pZCIsImVtYWlsIjoiYUBhLnNlIiwiY2xhaW1zIjpbImdhdGUiLCJnYXJhZ2UiXX0.OCXh6HWoE89rOOZ28j2RbDkemH8CLRM2j5xSrv7MDSTxB37u8OKsRMVErRQVMW1tyvJARzgfHvTZd39tIbMdvy0RpEYP2CM5z9OF-GTHSJtzDrbArf4oeZ8Uf9d3cq4lnpfyYoF7Z8ANeIVY5QzqKZ1vnvprukCRVwKJbabpuvNB-6TuPpr30d1ZWlHRdtDVN8iRCM22d9Jtbd-NmIwmVjXMIlgpy0aAniFcXhaZJFFhSxgka2LKxq3r2Ij_nOuXgLQrhklNQRKy_dwUM6S6IrKIE5KKb2LpZSuyBGP7pimgUwL5TuknFsVI06uM2Gu-d5Gk9RmFv-vr6WkkfoaSwQ",
        },
    };

    public async getGateState(): Promise<string> {
        try {
            let response = await axios.get(
                config.settings.gateBase + config.settings.gateState,
                this.requestConfig);

            return response?.data?.message;
        } catch (error) {
            debug(`Caught exception while getting gate state: ${error}`);

            return error;
        }
    }

    public async openGate(): Promise<Array<string>> {
        return await this.post(config.settings.garageBase + config.settings.gateOpen);
    }

    public async closeGate(): Promise<Array<string>> {
        return await this.post(config.settings.garageBase + config.settings.gateClose);
    }

    public async moveGate(): Promise<Array<string>> {
        return await this.post(config.settings.garageBase + config.settings.gateMove);
    }

    private async post(uri: string): Promise<any> {
        try {
            let response = await axios.post(uri, this.requestConfig);

            return response;
        } catch (error) {
            debug(`Caught exception while operating gate at: ${uri}`);

            return undefined;
        }
    }
}
export const gateService = new GateService();