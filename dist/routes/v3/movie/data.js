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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
        res.send({ error: "Invalid movie ID provided." });
        return;
    }
    if (!id.match(/^[0-9]+$/)) {
        res.send({ error: "Movie ID must be a number." });
        return;
    }
    try {
        const { TMDB_API_URL, TMDB_API_KEY, TMDB_IMAGE_URL } = process.env;
        const tmdb_req = yield axios_1.default.get(`${TMDB_API_URL}/movie/${id}?append_to_response=images,recommendations&api_key=${TMDB_API_KEY}&language=en`);
        const tmdb_res = tmdb_req.data;
        if (!tmdb_res || !tmdb_res['id']) {
            res.send({ error: "Invalid movie ID." });
            return;
        }
        if (!tmdb_res['backdrop_path'] || typeof tmdb_res['backdrop_path'] !== "string") {
            throw new Error("backdrop_path missing or empty in response");
        }
        if (!tmdb_res['images']) {
            throw new Error("images missing in response");
        }
        if (!tmdb_res['images']['logos'] || !tmdb_res['images']['logos'].length) {
            throw new Error("images.logos missing or empty in response");
        }
        if (!tmdb_res['recommendations']) {
            throw new Error("recommendations missing or empty in response");
        }
        if (!("results" in tmdb_res['recommendations'])) {
            throw new Error("recommendations.results does not exist");
        }
        let suggested = [];
        for (let i = 0; i < tmdb_res['recommendations']['results'].length; i++) {
            const r = tmdb_res['recommendations']['results'][i];
            if (!("poster_path" in r) || !r['poster_path']) {
                continue;
            }
            suggested.push({
                id: r['id'],
                title: r['title'],
                image: `${TMDB_IMAGE_URL}/w300` + r['poster_path'],
                type: r.media_type
            });
        }
        res.send({
            success: true,
            data: {
                id: tmdb_res['id'],
                title: tmdb_res['title'],
                description: tmdb_res['overview'],
                tagline: tmdb_res['tagline'] && tmdb_res['tagline'].length ? tmdb_res['tagline'] : null,
                genres: tmdb_res['genres'].map((v) => v.name),
                date: tmdb_res['release_date'],
                runtime: tmdb_res['runtime'],
                suggested: suggested,
                images: {
                    backdrop: TMDB_IMAGE_URL + "/original" + tmdb_res['backdrop_path'],
                    poster: TMDB_IMAGE_URL + "/w500" + tmdb_res['poster_path'],
                    logo: TMDB_IMAGE_URL + "/w500" + tmdb_res['images']['logos'][0].file_path
                }
            }
        });
    }
    catch (err) {
        console.log(`Failed to load movie (${id}) data:`, err);
        res.send({ error: "An error occurred." });
    }
});
