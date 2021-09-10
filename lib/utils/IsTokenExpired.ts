import { decode } from "jsonwebtoken";
import * as Debug from "debug";
const debug = Debug("isAuthenticated");

export const isTokenExpired = (token: string): boolean => {
    let decodedToken = decode(token);

    return Math.floor(Date.now() / 1000) > decodedToken.exp;
};

export default isTokenExpired;