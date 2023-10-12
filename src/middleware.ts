import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  if(!process.env.ORIGIN){
    throw new Error("ORIGIN not set in .env file");
  }

  res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN);

  next();
}