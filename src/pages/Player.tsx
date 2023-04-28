import { useState, useEffect, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom"

import conf from "../config";

export default function Player(){
  const { id } = useParams();

  const [loaded, setLoaded] = useState<boolean>(false);

  const [type, setType] = useState<"tv"|"movie">("movie");

  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);

  useEffect(() => {
    setLoaded(false);

    const s = new URLSearchParams(location.search);

    if(s.has("s") && s.has("e")){
      let nSeason = parseInt(s.get("s")!);
      let nEpisode = parseInt(s.get("e")!);

      if(!nSeason || !nEpisode){
        return;
      }

      if(nSeason < 1) nSeason = 1;
      if(nEpisode < 1) nEpisode = 1;
      
      setType("tv");
      setSeason(nSeason);
      setEpisode(nEpisode);
    }
  }, [id]);

  return (
    <Fragment>
      <Helmet>
        <title>Player - {conf.SITE_TITLE}</title>
      </Helmet>

      {
        !loaded && 
        <div className="loading">
          <div className="spinner">
            <i className="fa-solid fa-spinner-third"></i>
          </div>
        </div>
      }

      <div className="player">
        {
          type === "movie" ?
          <iframe
          allowFullScreen
          onLoad={() => setLoaded(true)}
          src={`${conf.RIPPER_API}/v2/embed/movie?id=${id}`}></iframe>
          :
          <iframe
          allowFullScreen
          onLoad={() => setLoaded(true)}
          src={`${conf.RIPPER_API}/v2/embed/tv?id=${id}&s=${season}&e=${episode}`}></iframe>
        }

        {
          loaded && 
          <div className="overlay">
            <Link to="/">
              <i className="fa-light fa-home"></i>
            </Link>

            <Link to={`/${type}/${id}`}>
              <i className="fa-regular fa-xmark"></i>
            </Link>
          </div>
        }
      </div>
    </Fragment>
  ) 
}