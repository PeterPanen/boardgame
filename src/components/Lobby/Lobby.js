import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./Lobby.module.css";

const lobbyHost = "http://localhost:8000";

export default function Lobby() {
  const [cookies, setCookie] = useCookies(["playerName"]);
  const [matches, setMatches] = useState([]);

  // On Mount
  useEffect(() => {
    fetchMatches();
    const timer = setInterval(() => fetchMatches(), 1000);
    return () => clearInterval(timer);
  }, []);

  async function fetchMatches() {
    const payload = await fetch(lobbyHost + "/games/TurnbasedGame");
    const json = await payload.json();
    setMatches(json.rooms);
  }

  async function createMatch() {
    const payload = await fetch(lobbyHost + "/games/TurnbasedGame/create", {
      method: "POST",
      body: JSON.stringify({
        numPlayers: 2
      })
    });
    const json = await payload.json();
    fetchMatches();
  }

  return (
    <div className={styles.container}>
      <h1>Lobby</h1>
      <div>
        <h2>Matches</h2>
        <div className={styles.matchesContainer}>
          {matches.map(m => (
            <div key={m.gameID} className={styles.match}>
              {m.gameID}
            </div>
          ))}
        </div>
      </div>
      <button onClick={createMatch}>Create Match</button>
    </div>
  );
}
