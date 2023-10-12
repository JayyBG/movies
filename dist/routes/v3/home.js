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
function getHero() {
    return __awaiter(this, void 0, void 0, function* () {
        const hero_id = Number(process.env.HERO_ID);
        const api_url = process.env.TMDB_API_URL;
        const api_key = process.env.TMDB_API_KEY;
        const backdrop_url = `${api_url}/movie/${hero_id}?api_key=${api_key}&language=en`;
        const logo_url = `${api_url}/movie/${hero_id}/images?api_key=${api_key}`;
        try {
            const backdropReq = yield axios_1.default.get(backdrop_url);
            const logoReq = yield axios_1.default.get(logo_url);
            const backdrop = backdropReq.data.backdrop_path;
            const logo = logoReq.data.logos[0].file_path;
            return {
                id: hero_id,
                backdrop: `${process.env.TMDB_IMAGE_URL}/original${backdrop}`,
                logo: `${process.env.TMDB_IMAGE_URL}/w500${logo}`,
            };
        }
        catch (err) {
            console.log("Failed to load hero data:", err);
            throw new Error("Failed to load hero data");
        }
    });
}
function getCollection(url, title, type) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const req = yield axios_1.default.get(url);
            const res = yield req.data;
            if (!("results" in res)) {
                throw new Error(`No results in response for ${title} using ${url}`);
            }
            const data = [];
            for (let i = 0; i < res['results'].length; i++) {
                const result = res['results'][i];
                if (!result['poster_path'])
                    continue;
                data.push({
                    id: result['id'],
                    title: result['title'] || result['name'],
                    image: process.env.TMDB_IMAGE_URL + "/w300" + result['poster_path'],
                    type
                });
            }
            return { title, data };
        }
        catch (err) {
            console.log(`Failed to load ${title} data:`, err);
        }
    });
}
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const api_url = process.env.TMDB_API_URL;
    const api_key = process.env.TMDB_API_KEY;
    const hero = yield getHero();
    const collections = yield Promise.all([
        getCollection(`${api_url}/trending/movie/week?api_key=${api_key}&language=en`, "Trending Movies", "movie"),
        getCollection(`${api_url}/movie/top_rated?api_key=${api_key}&language=en`, "Top Rated Movies", "movie"),
        getCollection(`${api_url}/trending/tv/week?api_key=${api_key}&language=en`, "Trending TV Shows", "tv"),
        getCollection(`${api_url}/tv/top_rated?api_key=${api_key}&language=en`, "Top Rated TV Shows", "tv")
    ]);
    res.send({ success: true, data: { hero, collections } });
});
