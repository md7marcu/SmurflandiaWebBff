import Debug from "debug";
const debug = Debug("SmurflandiaWebBff:StateController:");

export default class ServerService {
    getAliveMessage(): string {
        return "Alive!";
    }

}
export const serverService = new ServerService();