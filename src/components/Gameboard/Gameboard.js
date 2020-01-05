import React, { useState, useEffect } from "react";
import cx from "classnames";
import { withRouter } from "react-router";
import { getPath } from "../../utils/mapHelpers";
import { UNIT_TYPES } from "../../utils/unitTypes";
import Unit from "../Unit/Unit";
import styles from "./Gameboard.module.css";

const IS_DEV = process.env.NODE_ENV === "development";

const lobbyHost = IS_DEV ? `http://${window.location.hostname}:8000` : `http://${window.location.hostname}/gameapi`;

function renderMapUnit(unit, key) {
  switch (unit.type) {
    case UNIT_TYPES.TREE:
      return (
        <Unit
          {...unit}
          key={key}
          width={48}
          height={48}
          imageUrl="https://s.softdeluxe.com/icons/png/48/4893/4893866.png"
        />
      );
    default:
      return null;
  }
}

function renderPlayerUnit(unit, key) {
  return (
    <Unit
      {...unit}
      type="player"
      key={key}
      width={48}
      height={48}
      imageUrl="https://fiverr-res.cloudinary.com/images/t_smartwm/t_delivery_thumb,q_auto,f_auto/deliveries/98764286/original/coennijenhuis_sprite_001/create-a-pixel-art-character.png"
    />
  );
}

export default withRouter(function Gameboard({ G, ctx, moves, events, isActive, playerID, match }) {
  const [highlightedOptions, setHighlightedOptions] = useState({
    tiles: null,
    isValid: false,
    border: "2px solid #5bff69",
    backgroundColor: "rgba(91, 255, 105, 0.4);"
  });

  const [matchInfo, setMatchInfo] = useState(undefined);
  useEffect(() => {
    fetchMatch();
  }, []);

  const { actionPoints, x: playerX, y: playerY } = G.playerUnits[ctx.currentPlayer];
  const { mapUnits, playerUnits } = G;
  const players = playerUnits.map((p, idx) => ({ ...p, playerName: matchInfo?.players[idx].name }));

  function onClick(x, y) {
    if (!isActive) return;
    moves.clickCell(x, y);
    setHighlightedOptions({ tiles: null });
  }

  function getDynamicStyle(x, y) {
    if (highlightedOptions.tiles && highlightedOptions.tiles.find(val => val.x === x && val.y === y)) {
      return {
        cursor: "pointer",
        backgroundColor: highlightedOptions.backgroundColor,
        border: highlightedOptions.border
      };
    }
    return {};
  }

  function getTileContent(x, y) {
    if (highlightedOptions.tiles) {
      const index = highlightedOptions.tiles.findIndex(val => val.x === x && val.y === y);
      if (index > 0) return index;
    }
    return null;
  }

  function onHover(x, y, e) {
    if (!isActive) return;
    const path = getPath(G, playerX, playerY, x, y);
    const isValid = path ? path.slice(1).length <= actionPoints : false;
    setHighlightedOptions({
      tiles: path,
      isValid,
      border: isValid ? "2px solid #5bff69" : "2px solid #d06868",
      backgroundColor: isValid ? "rgba(91, 255, 105, 0.4)" : "rgba(208, 104, 104, 0.4)"
    });
  }

  async function fetchMatch() {
    const payload = await fetch(lobbyHost + `/games/TurnbasedGame/${match.params.id}`);
    const json = await payload.json();
    setMatchInfo(json);
  }

  let winner = "";
  if (ctx.gameover) {
    winner =
      ctx.gameover.winner !== undefined ? (
        <div id="winner">Winner: {ctx.gameover.winner}</div>
      ) : (
        <div id="winner">Draw!</div>
      );
  }

  const grid = new Array(G.mapWidth * G.mapHeight).fill(0).map((cell, idx) => {
    const posX = idx % G.mapWidth;
    const posY = Math.floor(idx / G.mapHeight);
    return (
      <div
        className={styles.tile}
        style={getDynamicStyle(posX, posY)}
        key={idx}
        onClick={() => onClick(posX, posY)}
        onMouseEnter={e => onHover(posX, posY, e)}
      >
        {getTileContent(posX, posY)}
      </div>
    );
  });

  return (
    <div className={styles.backdrop}>
      <div className={styles.ripple}></div>
      <h1
        className={cx(styles.turnLabel, {
          [styles.green]: isActive,
          [styles.red]: !isActive && playerID !== null,
          [styles.blue]: playerID === null
        })}
      >
        {isActive && "Your Turn"}
        {!isActive && playerID !== null && "Opponents Turn"}
        {playerID === null && "Spectating"}
      </h1>
      <div>
        <div className={styles.terrainShadow}></div>
        <div className={styles.terrain}>
          {grid}
          <div className={styles.terrainBottom}></div>
          <div className={styles.mapUnitsContainer}>{mapUnits?.map(renderMapUnit)}</div>
          <div className={styles.playerUnitsContainer}>{players?.map(renderPlayerUnit)}</div>
        </div>
      </div>
      <svg>
        <filter id="turbulence" x="0" y="0" width="100%" height="100%">
          <feTurbulence id="sea-filter" numOctaves="1" seed="2" baseFrequency="0.02 0.05"></feTurbulence>
          <feDisplacementMap scale="20" in="SourceGraphic"></feDisplacementMap>
        </filter>
        <animate
          xlinkHref="#sea-filter"
          attributeName="baseFrequency"
          dur="60s"
          keyTimes="0;0.5;1"
          values="0.02 0.06;0.04 0.08;0.02 0.06"
          repeatCount="indefinite"
        />
      </svg>
      {winner}
    </div>
  );
});
