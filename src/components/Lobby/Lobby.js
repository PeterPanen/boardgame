import React, { useEffect, useState } from "react";
import styles from "./Lobby.module.css";

const lobbyHost = "http://localhost:8000";

export default function Lobby() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  });

  async function fetchMatches() {
    const payload = await fetch(lobbyHost + "/games/TurnbasedGame");
    console.log(await payload.json());
  }

  async function createMatch() {}

  return (
    <div className={styles.container}>
      <div>Lobby</div>
      <div>Matches:</div>
      <button onClick={createMatch}>Create Match</button>
    </div>
  );
}
