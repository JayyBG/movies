import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";

import middleware from "./middleware";
import routes from "./routes";

dotenv.config();

const app = express();

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.use(morgan('[:date[web]] :method :url - :req[origin] - :response-time ms - :req[cf-connecting-ip]', {
  skip: (req, _res) => {
      if(req.method === "OPTIONS") return true;
      if(req.path.startsWith("/stream")) return true;

      return false;
  }
}));

app.use(middleware);
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Stream API running on port ${process.env.PORT}`);
});