import UserModel from "./UserModel";
import IUser from "../interfaces/IUser";

export default class MongoDb {
    // --------------------------------------------- USER ---------------------------------------------
    public async getUser(email: string): Promise<IUser> {
        return await UserModel.findOne({email: email, enabled: true}).lean();
    }
}