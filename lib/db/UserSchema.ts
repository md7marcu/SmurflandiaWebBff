import { Schema } from "mongoose";
import { hashSync, genSaltSync } from "bcryptjs";

export const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    idTokens: [{
        token: {
            type: String,
        },
        created: {
            type: Number,
        },
        expires: {
            type: Number,
        },
    }],
    accessTokens: [{
        token: {
            type: String,
        },
        created: {
            type: Number,
        },
        expires: {
            type: Number,
        },
    }],
    refreshTokens: [{
        token: {
            type: String,
        },
        created: {
            type: Number,
        },
        expires: {
            type: Number,
        },
        clientId: {
            type: String,
        },
        scopes: {
            type: [String],
        },
        userId: {
            type: String,
        },
    }],
    claims: [{
        type: String,
    }],
    code: String,
    nonce: String,
    lastAuthenticated: String,
    enabled: { type: Boolean, default: false},
});

UserSchema.pre("save", function(next) {
    let user: any = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
        return next();
    }

    // generate a salt
    let salt = genSaltSync(10);
    let hash = hashSync(user.password, salt);
    // override the cleartext password with the hashed one
    user.password = hash;
    next();
});