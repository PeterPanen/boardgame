import EasyStar from "easystarjs";

const easystar = new EasyStar.js();
easystar.enableSync();

export const getPath = (G, fromX, fromY, toX, toY) => {
  let validPath = undefined;
  const grid = new Array(G.mapHeight).fill(0).map(() => new Array(G.mapWidth).fill(0));

  G.mapUnits.forEach(unit => (grid[unit.y][unit.x] = 1));
  easystar.setGrid(grid);
  easystar.setAcceptableTiles([0]);
  easystar.findPath(fromX, fromY, toX, toY, path => {
    if (path) validPath = path;
  });
  easystar.calculate();
  return validPath;
};
