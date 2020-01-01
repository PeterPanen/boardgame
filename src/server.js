import { Server } from "boardgame.io/server";
import { TurnbasedGame } from "./gamelogic";

const server = Server({ games: [TurnbasedGame] });
server.run(8000);
