import { Server } from "boardgame.io/server";
import Router from "koa-router";
import { TurnbasedGame } from "./gamelogic";

const version = String(process.env.BUILD_NUMBER);
const router = new Router();
const server = Server({ games: [TurnbasedGame] });

router.get("/version", (ctx, next) => {
  ctx.res.setHeader("Access-Control-Allow-Origin", "*");
  ctx.body = { version };
});

server.app.use(router.routes());
server.run(8000);
