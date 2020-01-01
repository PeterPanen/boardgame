import React, { useEffect, useState } from "react";
import styles from "./Unit.module.css";

export default function Unit({ path, imageUrl, width, height, x, y }) {
  const [targetPosition, setTargetPosition] = useState({ x, y, isInMotion: false });

  useEffect(() => {
    if (
      path.length &&
      !targetPosition.isInMotion &&
      (path[path.length - 1].x !== targetPosition.x || path[path.length - 1].y !== targetPosition.y)
    ) {
      setTargetPosition({ isInMotion: true });
      path
        .slice(1)
        .forEach((pos, idx) =>
          setTimeout(
            () => setTargetPosition({ x: pos.x, y: pos.y, isInMotion: idx + 2 === path.length ? false : true }),
            300 * (idx + 1)
          )
        );
    }
  }, [path, targetPosition.isInMotion, targetPosition.x, targetPosition.y]);

  const style = {
    width,
    height,
    backgroundImage: `url(${imageUrl})`,
    transform: `translate3d(${targetPosition.x * 48}px, ${targetPosition.y * 48 - 10}px, 0)`
  };
  return <div className={styles.unit} style={style}></div>;
}
