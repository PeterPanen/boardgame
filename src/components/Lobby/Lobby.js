import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { withRouter } from "react-router";
import styles from "./Lobby.module.css";

const IS_DEV = process.env.NODE_ENV === "development";

const lobbyHost = IS_DEV ? `http://${window.location.hostname}:8000` : `http://${window.location.hostname}/gameapi`;

export default withRouter(function Lobby({ match, location, history }) {
  const [cookies, setCookie] = useCookies(["playerName", "myMatches"]);
  const [matches, setMatches] = useState([]);
  const [version, setVersion] = useState("");

  const myMatches = cookies.myMatches ? cookies.myMatches : [];

  // On Mount
  useEffect(() => {
    fetchMatches();
    fetchVersion();
    const timer = setInterval(() => fetchMatches(), 2000);
    return () => clearInterval(timer);
  }, []);

  async function fetchVersion() {
    const payload = await fetch(lobbyHost + "/version");
    const json = await payload.json();
    setVersion(String(json.version));
  }

  async function fetchMatches() {
    const payload = await fetch(lobbyHost + "/games/TurnbasedGame");
    const json = await payload.json();
    setMatches(json.rooms);
  }

  async function createMatch() {
    await fetch(`${lobbyHost}/games/TurnbasedGame/create`, {
      method: "POST",
      body: JSON.stringify({
        numPlayers: 2
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    fetchMatches();
  }

  async function joinMatch(match) {
    const availablePlayerId = match.players.findIndex(p => !p.name);
    try {
      const result = await fetch(`${lobbyHost}/games/TurnbasedGame/${match.gameID}/join`, {
        method: "POST",
        body: JSON.stringify({
          playerID: availablePlayerId,
          playerName: cookies.playerName
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (result.status > 200) throw new Error("Failed to join match.");
      const json = await result.json();
      setCookie("myMatches", [
        ...myMatches,
        { matchID: match.gameID, credentials: json.playerCredentials, playerID: availablePlayerId }
      ]);
      fetchMatches();
    } catch (error) {
      console.log(error.message);
    }
  }

  function playMatch(match) {
    history.push(`/game/${match.gameID}`);
  }

  function spectateMatch(match) {
    history.push(`/game/${match.gameID}`);
  }

  function canJoinMatch(match) {
    const attendingMatches = myMatches.map(m => m.matchID);
    return match.players.filter(p => !p.name).length > 0 && !attendingMatches.includes(match.gameID);
  }

  function canSpectateMatch(match) {
    const attendingMatches = myMatches.map(m => m.matchID);
    return !attendingMatches.includes(match.gameID);
  }

  function canPlayMatch(match) {
    const attendingMatches = myMatches.map(m => m.matchID);
    return attendingMatches.includes(match.gameID);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Lobby</h1>
        <h3>v. {version}</h3>
      </div>
      <div>
        <h2>Matches</h2>
        <div className={styles.matchesContainer}>
          {matches.map(m => (
            <div key={m.gameID} className={styles.match}>
              <div className={styles.matchid}>Match ID: {m.gameID}</div>
              <div className={styles.right}>
                <div className={styles.matchPlayers}>
                  {m.players.map((p, idx) => (
                    <span key={idx}>{p.name ? p.name : "Empty Slot"}</span>
                  ))}
                </div>
                {canJoinMatch(m) && (
                  <button className={styles.btnJoin} onClick={() => joinMatch(m)}>
                    Join
                  </button>
                )}
                {canSpectateMatch(m) && (
                  <button className={styles.btnJoin} onClick={() => spectateMatch(m)}>
                    Spectate
                  </button>
                )}
                {canPlayMatch(m) && (
                  <button className={styles.btnJoin} onClick={() => playMatch(m)}>
                    Play
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className={styles.btnCreate} onClick={createMatch}>
        Create Match
      </button>
    </div>
  );
});
