import { config } from "node-config-ts";
import axios from "axios";
import Debug from "debug";
import api from "../utils/GateApi";
const debug = Debug("SmurflandiaWebBff:GateController:");

export default class GateService {
    readonly requestConfig = {
        headers: {
            // tslint:disable-next-line:max-line-length
            "Authorization": "Bearer " + "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRob3JpemUudWx0cmFrb21waXMuY29tIiwiYXVkIjoiYXBpLnVsdHJha29tcGlzLmNvbSIsInN1YiI6ImFAYS5zZSIsImV4cCI6MTYyMjE3NTMzNCwiaWF0IjoxNjIyMTcxNzA0LCJzY29wZSI6Im9wZW5pZCIsImVtYWlsIjoiYUBhLnNlIiwiY2xhaW1zIjpbImdhdGUiLCJnYXJhZ2UiXX0.i-aM-yIMAS5r65NvzpoBo9iBZTCDfDpfn4-7HB9cfaB_dV3GyCuFaWSHp-iMxPUjuquoAKR9EHPHW1Fvix6itnWWFq_Do8VkN6UgOwXavBLq-B65ruaRWrNNkBX1YGHlT7-cnMuMh1LAQtoq3wIKfsNCq31sWwCq6F47gxnKUMtkRv5Z2fS1lzryuEAjJd6zy7kD65gu8TRZ9KKySyDAEJ3ovwSlVQgAJ69wcFCxsBpRy1u36_4oScqFduNi8htAwpXniIakdkd615aJ2FV-a6s6oCFbNpAD1846bG8EknpYwhTRmk6lU7Ln88Zm3ORyXCVWjCH_YylC2W5ZABpG7w",
        },
    };

    public async getAliveMessage(): Promise<string> {
        return await this.get(config.settings.gateAlive);
     }

     public async getProtectedAliveMessage(): Promise<string> {
        return await this.get(config.settings.gateProtectedAlive);
     }

    public async getGateState(): Promise<string> {
       return await this.get(config.settings.gateState);
    }

    //TODO: Open gate is not implemented on api
    public async openGate(): Promise<Array<string>> {
        return await this.post(config.settings.gateMove);
    }

    //TODO: Close gate is not implemented on api
    public async closeGate(): Promise<Array<string>> {
        return await this.post(config.settings.gateMove);
    }

    public async moveGate(): Promise<Array<string>> {
        return await this.post(config.settings.gateMove);
    }


    private async get(uri: string): Promise<any> {
    try {
        let response = await api.get(uri, this.requestConfig);

        return response?.data;
    } catch (error) {
        throw error;
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
}
export const gateService = new GateService();