import Debug from "debug";
import { config } from "node-config-ts";
import api from "../utils/IdpApi";
const debug = Debug("SmurflandiaWebBff:StateController:");

export default class ServerService {
    private requestConfig = { headers: { "Authorization": ""}};

    async getUserInfo(token: string): Promise<Object> {
        this.requestConfig.headers.Authorization = token;

        try {
            let response = await api.get(config.settings.idp + config.settings.userinfoEndpoint, this.requestConfig);

            return response?.data;
        } catch (error) {
            throw error;
        }
    }

    getAliveMessage(): string {
        return "Alive!";
    }
}
export const serverService = new ServerService();