import { Request } from "express";
export interface IRequest extends Request {
    access_token: string;
    session: any;
}