import { find } from "lodash";
import { config } from "node-config-ts";
import IUser from "../interfaces/IUser";
import MongoDb from "./mongoDb";

export default class Db {
    private users = config.settings.users;
    private useMongo: boolean = config.settings.useMongo;

    public async getUser(email: string): Promise<IUser> {
        if (this.useMongo) {
            return await new MongoDb().getUser(email);
        } else {
            return find(this.users, (u) => u.email === email);
        }
    }
}
