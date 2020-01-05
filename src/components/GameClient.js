import React from "react";
import { withRouter } from "react-router";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { useCookies } from "react-cookie";
import Gameboard from "./Gameboard/Gameboard";
import { TurnbasedGame } from "../gamelogic";

const IS_DEV = process.env.NODE_ENV === "development";

const GameClient = Client({
  game: TurnbasedGame,
  board: Gameboard,
  multiplayer: SocketIO({ server: IS_DEV ? `${window.location.hostname}:8000` : `${window.location.hostname}` }),
  debug: false
});

export default withRouter(({ match, location }) => {
  const [cookies] = useCookies(["myMatches"]);
  const myMatch = cookies.myMatches?.find(m => m.matchID === match.params.id);

  const gameProps = {
    gameID: match.params.id,
    ...(myMatch ? { playerID: String(myMatch.playerID) } : {}),
    ...(myMatch ? { credentials: myMatch.credentials } : {})
  };

  return <GameClient {...gameProps} />;
});
