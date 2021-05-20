import Debug from "debug";
const debug = Debug("SmurflandiaWebBff:StateController:");

export default class StateController {
    getAliveMessage(): String {
        return "Alive!";
    }

}