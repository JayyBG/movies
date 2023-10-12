"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const remoteStreamKey = "";
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { media } = req.params;
        const { id, e, s } = req.query;
        if (!media) {
            res.status(400).send({ error: "Invalid media type" });
            return;
        }
        if (!["movie", "tv"].includes(media)) {
            res.status(400).send({ error: "Invalid media type" });
            return;
        }
        if (!id || typeof id !== "string") {
            res.status(400).send({ error: "Invalid media id" });
            return;
        }
        try {
            let source = `https://remotestre.am/e/?tmdb=${id}&apikey=${remoteStreamKey}`;
            if (e && s) {
                source += `&s=${s}&e=${e}`;
            }
            res.render("embed", {
                source,
            });
        }
        catch (err) {
            console.log('Failed to render embed:', err);
            res.status(500).send({ error: "Failed" });
        }
    });
}
exports.default = default_1;
