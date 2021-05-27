import { config } from "node-config-ts";
import axios from "axios";
import Debug from "debug";
import api from "../utils/GateApi";
const debug = Debug("SmurflandiaWebBff:GateController:");

export default class GateService {
    readonly requestConfig = {
        headers: {
            // tslint:disable-next-line:max-line-length
            "Authorization": "Bearer " + "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRob3JpemUudWx0cmFrb21waXMuY29tIiwiYXVkIjoiYXBpLnVsdHJha29tcGlzLmNvbSIsInN1YiI6ImFAYS5zZSIsImV4cCI6MTYyMjE2MzM4NSwiaWF0IjoxNjIyMTU5NzU1LCJzY29wZSI6Im9wZW5pZCIsImVtYWlsIjoiYUBhLnNlIiwiY2xhaW1zIjpbImdhdGUiLCJnYXJhZ2UiXX0.JXEZdoVuINt1JIvBxotRoabtGMFByTCD5pGTaDPOt4Zwxwx24EBoI9gDLRsdAE678lGM04QLVbLW7Q9XyTRwZqZGVUdJyt8OCSSsvmun69M_QkDUPhSJqxIB8CRZ_NSE4l6fdbdJTll_Fr3cDI_8STu6ZDvIc3f-YH0U6sVvNySKotv8tMk00WW-CGg1azGJLv-dcNxMdSZScO1sCIVP_3fBbOOYcZ3sL4H0ZtlAFOAScKqFx9NIJ3EPZ3PrGxd-vZMXoGNALYiAB3S1_J1IZdWxga0GCcedf6GC2LaktLTYA2UTZjgVSrI5jioLNJMbTgHWbhG7xf9b5UKKb2C-Bg",
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

    //TODO: Open gate is not implemented on api
    public async closeGate(): Promise<Array<string>> {
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