import axios from "axios";
import { Request, Response } from "express";

import { Episode } from "../../../types";

export default async (req: Request, res: Response) => {
  const { id } = req.params;
  const { s } = req.query;

  if(!id || typeof id !== "string"){
    res.send({error: "Invalid tv series id provided."});
    return;
  }

  if(!id.match(/^[0-9]+$/)){
    res.send({error: "TV series ID must be a number."});
    return;
  }

  if(!s || typeof s !== "string"){
    res.send({error: "Missing season number."});
    return;
  }

  let season = parseInt(s);

  if(season < 1){
    res.send({error: "Invalid season number."});
    return;
  }

  try{
    const { TMDB_API_URL, TMDB_API_KEY, TMDB_IMAGE_URL } = process.env;

    const tmdb_req = await axios.get(`${TMDB_API_URL}/tv/${id}/season/${season}?api_key=${TMDB_API_KEY}&language=en`);
    const tmdb_res = tmdb_req.data;

    if(!("episodes" in tmdb_res)){
      throw new Error("No episodes available");
    }

    const episodes:Episode[] = [];

    for(let i = 0; i < tmdb_res['episodes'].length; i++){
      const e = tmdb_res['episodes'][i];

      if(!("still_path" in e) || !e['still_path']) continue;
      if(!("runtime" in e) || !e['runtime']) continue;

      episodes.push({
        number: e['episode_number'],
        image: TMDB_IMAGE_URL+"/w500"+e['still_path'],
        title: e['name'],
        runtime: e['runtime']
      });
    }

    if(!episodes.length){
      res.send({error: "No episodes available."});
      return;
    }

    res.send({success: true, data: episodes});
  }
  catch(err){
    console.log(`Failed to load tv series episodes (${id}) data:`, err);
    res.send({error: "An error occurred."});
  }
}