import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import ProtectedRoute from "../utils/ProtectedRoute";
import Login from "./Login/Login";
import Lobby from "./Lobby/Lobby";
import Gameboard from "./Gameboard/Gameboard";
import { TurnbasedGame } from "../gamelogic";
import "./App.css";

const GameClient = Client({
  game: TurnbasedGame,
  board: Gameboard,
  multiplayer: SocketIO({ server: "localhost:8000" }),
  debug: false
});

export default () => (
  <Router>
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <ProtectedRoute path="/game/:id">
        <GameClient playerID="0" />
      </ProtectedRoute>
      <ProtectedRoute path="/">
        <Lobby />
      </ProtectedRoute>
    </Switch>
  </Router>
);
