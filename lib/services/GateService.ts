import { config } from "node-config-ts";
import Debug from "debug";
import api from "../utils/GateApi";
const debug = Debug("SmurflandiaWebBff:GateController:");

export default class GateService {
    private requestConfig = { headers: { "Authorization": ""}};

    public async getAliveMessage(): Promise<string> {
        return await this.get(config.settings.gateAlive);
     }

     public async getProtectedAliveMessage(token: string): Promise<string> {
        this.requestConfig.headers.Authorization = token;
        return await this.get(config.settings.gateProtectedAlive);
     }

    public async getGateState(token: string): Promise<string> {
        this.requestConfig.headers.Authorization = token;
       return await this.get(config.settings.gateState);
    }

    // TODO: Open gate is not implemented on api
    public async openGate(token: string): Promise<Array<string>> {
        this.requestConfig.headers.Authorization = token;
        return await this.post(config.settings.gateMove);
    }

    // TODO: Close gate is not implemented on api
    public async closeGate(token: string): Promise<Array<string>> {
        this.requestConfig.headers.Authorization = token;
        return await this.post(config.settings.gateMove);
    }

    public async moveGate(token: string): Promise<Array<string>> {
        this.requestConfig.headers.Authorization = token;
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