import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";

function MovesSection({ movesCount, maxMovesCount }) {
  return (
    <div className={styles.section}>
      <h2>Moves</h2>
      <span>
        {movesCount} / {maxMovesCount}
      </span>
    </div>
  );
}

export default function Sidebar({ currentPlayerUnit, onEndClick }) {
  return (
    <div className={styles.container}>
      <MovesSection movesCount={currentPlayerUnit.actionPoints} maxMovesCount={currentPlayerUnit.maxActionPoints} />
      <button onClick={onEndClick} className={styles.btnEnd}>
        End Turn
      </button>
    </div>
  );
}
