import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProtectedRoute from "../utils/ProtectedRoute";
import Login from "./Login/Login";
import Lobby from "./Lobby/Lobby";
import GameClient from "./GameClient";
import "./App.css";

export default () => (
  <Router>
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/game/:id">
        <GameClient />
      </Route>
      <ProtectedRoute path="/">
        <Lobby />
      </ProtectedRoute>
    </Switch>
  </Router>
);
