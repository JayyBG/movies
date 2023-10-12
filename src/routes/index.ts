import express from "express";

import embed from "./v2/embed";

import home from "./v3/home";
import search from "./v3/search";
import movie from "./v3/movie/data";
import tv from "./v3/tv/data";
import tv_episodes from "./v3/tv/episodes";

const router = express.Router();

router.get("/v2/embed/:media", embed);

router.get("/v3/home", home);
router.get("/v3/search", search);
router.get("/v3/movie/:id", movie);
router.get("/v3/tv/:id", tv);
router.get("/v3/tv/:id/episodes", tv_episodes);

export default router;