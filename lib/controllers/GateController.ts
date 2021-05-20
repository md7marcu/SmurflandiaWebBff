import { config } from "node-config-ts";
import axios from "axios";
import Debug from "debug";
const debug = Debug("SmurflandiaWebBff:GateController:");

export default class GateController {
    readonly requestConfig = {
        headers: {
            // tslint:disable-next-line:max-line-length
            "Authorization": "Bearer " + "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRob3JpemUudWx0cmFrb21waXMuY29tIiwiYXVkIjoiYXBpLnVsdHJha29tcGlzLmNvbSIsInN1YiI6InVsdHJha29tcGlzIiwiZXhwIjoxNjEzODI5ODUxLCJpYXQiOjE2MTM4MjYyMjEsInNjb3BlIjoib3BlbmlkIiwiZW1haWwiOiJhQGEuc2UiLCJjbGFpbXMiOlsiZ2F0ZSIsImdhcmFnZSJdfQ.egqk8pmLyOyBGILuEGQtNO53hmonNutDx6zMzD48rlmprihfz4XT13IkCw4HxxCKoHmwqXbcgiglZ3lVfeI3wKGzD86WsRIGH20L2Y9xTwFsbuPAvj1ETFt-fW4eTCzc47NOdA3o5ZJg4V5ALdHiopmep4UHLCTDEroILLcHBkfIJN5OE85ahRYQphKndMyMiMCI2owXTqE4N25ct8DbwMlu6a8CKL-h6vHwJFd6mTfD6UXqWkwnjKJe_daYWxu1L3_FH2xi0-JiZjQzBLL4GF0sV0vVesD20Cfheo85YYqSVtjhIdE2ruIBHdfa9BbMCD6j-1uz8rEvR7U6dpAeZg",
        },
    };

    public async getGateState(): Promise<String> {
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

    public async openGate(): Promise<Array<String>> {
        return await this.post(config.settings.garageBase + config.settings.gateOpen);
    }

    public async closeGate(): Promise<Array<String>> {
        return await this.post(config.settings.garageBase + config.settings.gateClose);
    }

    public async moveGate(): Promise<Array<String>> {
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