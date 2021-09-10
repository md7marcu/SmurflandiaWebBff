import { Response, NextFunction } from "express";
import { IRequest } from "../interfaces/IRequest";
import { asyncHandler } from "../middleware/async";
import { ErrorResponse } from "../utils/ErrorResponse";
import { Client } from "openid-client";
import * as Debug from "debug";
import isTokenExpired from "./IsTokenExpired";
const debug = Debug("isAuthenticated");

export const isAuthenticated = (client: Client) => {
    return asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {

        if (!req?.user?.tokenset) {
            next(new ErrorResponse("No token present.", 401));
        }
        if (req.isAuthenticated()) {
            return next();

        } else if (req.user.tokenset.access_token && isTokenExpired(req.user.tokenset.id_token)) {
            req.user.tokenset = await client.refresh(req.user.tokenset);
            debug("Refreshed token after getting 401.");

            if (req.isAuthenticated()) {
                return next();
            }
            debug("Still getting 401 even after resfresh.");
        }
        next(new ErrorResponse("Unauthorized.", 401));
    });
};

export default isAuthenticated;