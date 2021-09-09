import { Response, NextFunction } from "express";
import { IRequest } from "../interfaces/IRequest";
import { config } from "node-config-ts";
import api from "../utils/IdpApi";
import * as Debug from "debug";
const debug = Debug("ExchangeToken");

export const exchangeTokenMiddleware = async(req: IRequest, res: Response, next: NextFunction) =>  {
    try {
        let accessToken = await exchangeToken(req?.user?.tokenset?.id_token);
        req.exchanged_token = accessToken;
        next();
    } catch (error) {
        debug(`Failed to exchange token ${error}`);
        next(error?.message);
    }
};

export const exchangeToken = async(idToken: string) => {
    try {
        let response = await api.post(config.settings.idp + config.settings.accessTokenEndpoint,
            {
                grant_type: config.settings.tokenExchangeGrant,
                subject_token_type: config.settings.tokenExchangeSubjectType,
                subject_token: idToken,
            },
            {
                auth: {
                    username: config.settings.client.client_id,
                    password: config.settings.client.client_secret,
                },
            },
        );
            return response?.data?.access_token;
        } catch (error) {
            debug(`Failed to exchange token (post) ${error}`);

            throw error;
        }
};

export default exchangeTokenMiddleware;