import React, { useState } from "react";
import cx from "classnames";
import { getPath } from "../../utils/mapHelpers";
import { UNIT_TYPES } from "../../utils/unitTypes";
import Unit from "../Unit/Unit";
import styles from "./Gameboard.module.css";

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
      key={key}
      width={48}
      height={48}
      imageUrl="https://fiverr-res.cloudinary.com/images/t_smartwm/t_delivery_thumb,q_auto,f_auto/deliveries/98764286/original/coennijenhuis_sprite_001/create-a-pixel-art-character.png"
    />
  );
}

export default function Gameboard({ G, ctx, moves, events, isActive, playerID }) {
  const [highlightedOptions, setHighlightedOptions] = useState({
    tiles: null,
    isValid: false,
    border: "2px solid #5bff69",
    backgroundColor: "rgba(91, 255, 105, 0.4);"
  });

  const { actionPoints, x: playerX, y: playerY } = G.playerUnits[ctx.currentPlayer];
  const { mapUnits, playerUnits } = G;

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
          <div className={styles.playerUnitsContainer}>{playerUnits?.map(renderPlayerUnit)}</div>
        </div>
      </div>
      {winner}
    </div>
  );
}
