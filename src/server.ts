import express, { Request, Response } from "express";
import path from "path";
import mustache from "mustache-express";
import mainRoutes from "./routes/index";
import bodyParser from "body-parser";

const server = express();

server.set("view engine", "mustache");
server.set("views", path.join(__dirname, "./views"));
server.engine("mustache", mustache());

server.use(express.static(path.join(__dirname, "../public")));
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(mainRoutes);

server.use((req: Request, res: Response) => {
  res.status(404).send("404 ERROR");
});

server.listen(process.env.PORT || 80);
