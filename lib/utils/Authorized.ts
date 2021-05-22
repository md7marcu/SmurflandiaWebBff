import { IRequest } from "../interfaces/IRequest";
import { includes } from "lodash";
import { config } from "node-config-ts";

export const garageAuthorized = (req: IRequest) => {
    return includes((req.access_token as any).claims, config.settings.garageClaim);
}

export const gateAuthorized = (req: IRequest) => {
    return includes((req.access_token as any).claims, config.settings.gateClaim);
}

export const userAuthorized = (req: IRequest) => {
    return req && req.access_token;
}

