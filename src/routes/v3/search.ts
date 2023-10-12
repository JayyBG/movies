import axios from 'axios';
import { Request, Response } from 'express';

import { Poster } from '../../types';

export default async (req:Request, res:Response) => {
  const { query } = req.query;

  if(typeof query !== "string" || !query.length){
    res.send({error: "Invalid query."});
    return;
  }

  if(query.trim().length < 3){
    res.send({error: "Search must be at least 3 characters."});
    return;
  }

  if(query.trim().length > 100){
    res.send({error: "Search must be less than 100 characters."});
    return;
  }

  if(!query.match(/^[a-zA-Z0-9 ]+$/)){
    res.send({error: "Search only letters, numbers and spaces."});
    return;
  }

  try{
    const { TMDB_API_URL, TMDB_API_KEY, TMDB_IMAGE_URL } = process.env;

    const tmdb_req = await axios.get(TMDB_API_URL+"/search/multi?api_key="+TMDB_API_KEY+"&language=en&query="+query);
    const tmdb_res = tmdb_req.data;

    if(!tmdb_res || !tmdb_res['results'] || !tmdb_res['results'].length){
      res.send({error: "No results found."});
      return;
    }

    const data:Poster[] = [];

    for(let i = 0; i < tmdb_res['results'].length; i++){
      const r = tmdb_res['results'][i];

      if(!("poster_path" in r) || !("backdrop_path" in r)){
        continue;
      }

      if(!r['poster_path'] || r['poster_path'] === null){
        continue;
      }

      if(!r['vote_count']){
        continue;
      }

      data.push({
        id: r['id'],
        title: r['media_type'] === "movie" ? r['title'] : r['name'],
        image: TMDB_IMAGE_URL+"/w300"+r['poster_path'],
        type: r['media_type']
      });
    }

    res.send({ success: true, data });
  }
  catch(err){
    console.log(`Failed to load search (${query}) data:`, err);
    res.send({error: "An error occurred."});
  }
}