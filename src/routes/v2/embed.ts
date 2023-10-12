import { Request, Response } from "express";

const remoteStreamKey = "";

export default async function (req:Request, res:Response): Promise<void>{
  const { media } = req.params;
  const {id, e, s} = req.query;

  if(!media){
    res.status(400).send({error: "Invalid media type"});
    return;
  }

  if(!["movie", "tv"].includes(media)){
    res.status(400).send({error: "Invalid media type"});
    return;
  }

  if(!id || typeof id !== "string"){
    res.status(400).send({error: "Invalid media id"});
    return;
  }

  try{
    let source = `https://remotestre.am/e/?tmdb=${id}&apikey=${remoteStreamKey}`;

    if(e && s){
      source += `&s=${s}&e=${e}`;
    }

    res.render("embed", {
      source,
    });
  }
  catch(err:any){
    console.log('Failed to render embed:', err);
    res.status(500).send({error: "Failed"});
  }
}