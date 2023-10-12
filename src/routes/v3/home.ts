import axios from "axios";
import { Request, Response } from "express";

import { Hero, Poster } from "../../types";

interface Collection{
  title: string;
  data: Poster[];
}

async function getHero(): Promise<Hero> {
  const hero_id = Number(process.env.HERO_ID);

  const api_url = process.env.TMDB_API_URL;
  const api_key = process.env.TMDB_API_KEY;
  const backdrop_url = `${api_url}/movie/${hero_id}?api_key=${api_key}&language=en`;
  const logo_url = `${api_url}/movie/${hero_id}/images?api_key=${api_key}`;
  
  try {
    const backdropReq = await axios.get(backdrop_url);
    const logoReq = await axios.get(logo_url);
    const backdrop = backdropReq.data.backdrop_path;
    const logo = logoReq.data.logos[0].file_path;

    return {
      id: hero_id,
      backdrop: `${process.env.TMDB_IMAGE_URL}/original${backdrop}`,
      logo: `${process.env.TMDB_IMAGE_URL}/w500${logo}`,
    };
  } catch (err) {
    console.log("Failed to load hero data:", err);
    throw new Error("Failed to load hero data");
  }
}

async function getCollection(url:string, title:string, type:"tv"|"movie"): Promise<undefined|Collection>{  
  try{
    const req = await axios.get(url);
    const res = await req.data;
  
    if(!("results" in res)){
      throw new Error(`No results in response for ${title} using ${url}`);
    }

    const data:Poster[] = [];

    for(let i = 0; i < res['results'].length; i++){
      const result = res['results'][i];

      if(!result['poster_path']) continue;

      data.push({
        id: result['id'],
        title: result['title'] || result['name'],
        image: process.env.TMDB_IMAGE_URL+"/w300"+result['poster_path'],
        type
      });
    }

    return { title, data };
  }
  catch(err){
    console.log(`Failed to load ${title} data:`, err);
  }
}

export default async (req: Request, res: Response) => {
  const api_url = process.env.TMDB_API_URL;
  const api_key = process.env.TMDB_API_KEY;

  const hero = await getHero();

  const collections = await Promise.all([
    getCollection(`${api_url}/trending/movie/week?api_key=${api_key}&language=en`, "Trending Movies", "movie"),
    getCollection(`${api_url}/movie/top_rated?api_key=${api_key}&language=en`, "Top Rated Movies", "movie"),
    getCollection(`${api_url}/trending/tv/week?api_key=${api_key}&language=en`, "Trending TV Shows", "tv"),
    getCollection(`${api_url}/tv/top_rated?api_key=${api_key}&language=en`, "Top Rated TV Shows", "tv")
  ]);

  res.send({success: true, data: {hero, collections}});
}