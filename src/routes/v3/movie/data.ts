import axios from 'axios';
import { Request, Response } from 'express';

import { Poster } from '../../../types';

export default async (req:Request, res:Response) => {
  const { id } = req.params;

  if(!id || typeof id !== "string"){
    res.send({error: "Invalid movie ID provided."});
    return;
  }

  if(!id.match(/^[0-9]+$/)){
    res.send({error: "Movie ID must be a number."});
    return;
  }
  
  try{
    const { TMDB_API_URL, TMDB_API_KEY, TMDB_IMAGE_URL } = process.env;

    const tmdb_req = await axios.get(`${TMDB_API_URL}/movie/${id}?append_to_response=images,recommendations&api_key=${TMDB_API_KEY}&language=en`);
    const tmdb_res = tmdb_req.data;

    if(!tmdb_res || !tmdb_res['id']){
      res.send({error: "Invalid movie ID."});
      return;
    }

    if(!tmdb_res['backdrop_path'] || typeof tmdb_res['backdrop_path'] !== "string"){
      throw new Error("backdrop_path missing or empty in response");
    }

    if(!tmdb_res['images']){
      throw new Error("images missing in response");
    }

    if(!tmdb_res['images']['logos'] || !tmdb_res['images']['logos'].length){
      throw new Error("images.logos missing or empty in response");
    }

    if(!tmdb_res['recommendations']){
      throw new Error("recommendations missing or empty in response");
    }

    if(!("results" in tmdb_res['recommendations'])){
      throw new Error("recommendations.results does not exist");
    }

    let suggested:Poster[] = [];

    for(let i = 0; i < tmdb_res['recommendations']['results'].length; i++){
      const r = tmdb_res['recommendations']['results'][i];

      if(!("poster_path" in r) || !r['poster_path']){
        continue;
      }

      suggested.push({
        id: r['id'],
        title: r['title'],
        image: `${TMDB_IMAGE_URL}/w300`+r['poster_path'],
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
        genres: tmdb_res['genres'].map((v:any) => v.name),
        date: tmdb_res['release_date'],
        runtime: tmdb_res['runtime'],
        suggested: suggested,
        images: {
          backdrop: TMDB_IMAGE_URL+"/original"+tmdb_res['backdrop_path'],
          poster: TMDB_IMAGE_URL+"/w500"+tmdb_res['poster_path'],
          logo: TMDB_IMAGE_URL+"/w500"+tmdb_res['images']['logos'][0].file_path
        }
      }
    });
  }
  catch(err){
    console.log(`Failed to load movie (${id}) data:`, err);
    res.send({error: "An error occurred."});
  }
}