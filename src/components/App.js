import React from "react";
import { Lobby } from "boardgame.io/react";
import Gameboard from "./Gameboard/Gameboard";
import { TurnbasedGame } from "../gamelogic";
import "./App.css";

export default () => (
  <div>
    <Lobby
      gameServer={`http://${window.location.hostname}:8000`}
      lobbyServer={`http://${window.location.hostname}:8000`}
      gameComponents={[{ game: TurnbasedGame, board: Gameboard }]}
    />
    ;
  </div>
);
