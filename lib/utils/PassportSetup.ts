import * as bcrypt from "bcryptjs";
import * as passport from "passport";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../db/UserModel";
import IUserDocument from "../interfaces/IUserDocument";
import { NativeError } from "mongoose";
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser<any, any>(( user, done) => {
    done(undefined, user);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: NativeError, user: IUserDocument) => done(err, user));
});

passport.use("local",
    new LocalStrategy({ usernameField: "username" },
    (email: any, password: string, done: (arg0: null, arg1: boolean | IUserDocument | null, arg2: { message: any; } | undefined) => void) => {

        UserModel.findOne({ email: email })
            .then(user => {

                bcrypt.compare(password, user?.password ?? "", (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        // tslint:disable-next-line:no-null-keyword
                        return done(null, user, undefined);
                    } else {
                        // tslint:disable-next-line:no-null-keyword
                        return done(null, false, { message: "Wrong password" });
                    }
                });
            })
            .catch(err => {
                return done(null, false, { message: err });
            });
    })
);

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

// TODO: Pass through the claims
// export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
//     const provider = req.path.split("/").slice(-1)[0];

//     const user = req.user as IUserDocument;
//     if (_.find(user.tokens, { kind: provider })) {
//         next();
//     } else {
//         res.redirect(`/auth/${provider}`);
//     }
// };
module.exports = passport;