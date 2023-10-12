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
        res.send({ error: "Invalid tv series id provided." });
        return;
    }
    if (!id.match(/^[0-9]+$/)) {
        res.send({ error: "TV series ID must be a number." });
        return;
    }
    try {
        const { TMDB_API_URL, TMDB_API_KEY, TMDB_IMAGE_URL } = process.env;
        const tmdb_req = yield axios_1.default.get(`${TMDB_API_URL}/tv/${id}?append_to_response=images,recommendations&api_key=${TMDB_API_KEY}&language=en`);
        const tmdb_res = tmdb_req.data;
        if (!tmdb_res || !tmdb_res['id']) {
            res.send({ error: "Invalid tv series ID." });
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
        if (!tmdb_res['number_of_seasons'] || tmdb_res['number_of_seasons'] < 1) {
            throw new Error("number_of_seasons missing or under 1");
        }
        const tmdb_episodes_req = yield axios_1.default.get(`${TMDB_API_URL}/tv/${id}/season/1?api_key=${TMDB_API_KEY}&language=en`);
        const tmdb_episodes_res = tmdb_episodes_req.data;
        if (!("episodes" in tmdb_episodes_res)) {
            throw new Error("No episodes available");
        }
        const episodes = [];
        for (let i = 0; i < tmdb_episodes_res['episodes'].length; i++) {
            const e = tmdb_episodes_res['episodes'][i];
            if (!("still_path" in e) || !e['still_path'])
                continue;
            if (!("runtime" in e) || !e['runtime'])
                continue;
            episodes.push({
                number: e['episode_number'],
                image: TMDB_IMAGE_URL + "/w500" + e['still_path'],
                title: e['name'],
                runtime: e['runtime']
            });
        }
        const suggested = [];
        for (let i = 0; i < tmdb_res['recommendations']['results'].length; i++) {
            const r = tmdb_res['recommendations']['results'][i];
            if (!("poster_path" in r) || !r['poster_path']) {
                continue;
            }
            suggested.push({
                id: r['id'],
                title: r['name'],
                image: `${TMDB_IMAGE_URL}/w300` + r['poster_path'],
                type: r.media_type
            });
        }
        const seasons = tmdb_res['seasons'].filter((v) => v['season_number'] && v['episode_count'] && v['episode_count'] > 0).length;
        res.send({
            success: true,
            data: {
                id: tmdb_res['id'],
                title: tmdb_res['name'],
                description: tmdb_res['overview'],
                tagline: tmdb_res['tagline'] && tmdb_res['tagline'].length ? tmdb_res['tagline'] : null,
                genres: tmdb_res['genres'].map((v) => v.name),
                date: tmdb_res['first_air_date'],
                seasons: seasons,
                episodes: episodes,
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
        console.log(`Failed to load tv series (${id}) data:`, err);
        res.send({ error: "An error occurred." });
    }
});
