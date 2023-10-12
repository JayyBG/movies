export interface Episode{
  number: number;
  title: string;
  image: string;
  runtime: number;
}

export interface Hero{
  id: number|string;
  backdrop: string;
  logo: string;
}

export interface Poster{
  id: number|string;
  title: string;
  image: string;
  type: "movie"|"tv"
}