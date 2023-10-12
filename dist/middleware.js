"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (req, res, next) => {
    if (!process.env.ORIGIN) {
        throw new Error("ORIGIN not set in .env file");
    }
    res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN);
    next();
};
