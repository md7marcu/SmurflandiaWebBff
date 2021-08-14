import Debug from "debug";
const debug = Debug("SmurflandiaWebBff:StateController:");
import { gateService } from "./GateService";
import { garageService } from "./GarageService";

export default class StateService {

    public async getStates(token: string): Promise<string[]> {
        let states;

        try {
            let gateState = await gateService.getGateState(token);
            let garageState = await garageService.getGarageState();
            garageState.unshift(gateState);
            states = garageState;
        } catch (error){
            throw error;
        }
        return states;
    }
}
export const stateService = new StateService();