import Debug from "debug";
const debug = Debug("SmurflandiaWebBff:StateController:");
import GateController from "./GateController";
import GarageController from "./GarageController";

export default class StateController {
    readonly gateController = new GateController();
    readonly garageController = new GarageController();

    public async getStates(): Promise<any> {
        let gateState = await this.gateController.getGateState();
        let garageState = await this.garageController.getGarageState();
        garageState.unshift(gateState);

        return garageState;
    }
}