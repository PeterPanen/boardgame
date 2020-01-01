import { getPath } from "./utils/mapHelpers";
import { UNIT_TYPES } from "./utils/unitTypes";

/* // Return true if `cells` is in a winning configuration.
function IsVictory(cells) {
  return false;
}

// Return true if all `cells` are occupied.
function IsDraw(cells) {
  return cells.filter(c => c === null).length === 0;
} */

const playerStartPositionMap = [
  {
    x: 0,
    y: 0
  },
  {
    x: 11,
    y: 11
  },
  {
    x: 11,
    y: 0
  },
  {
    x: 0,
    y: 11
  }
];

export const TurnbasedGame = {
  name: "TurnbasedGame",
  setup: ctx => ({
    mapWidth: 12,
    mapHeight: 12,
    playerUnits: new Array(ctx.numPlayers).fill(null).map((val, idx) => ({
      name: `Player ${idx + 1}`,
      health: 100,
      actionPoints: 6,
      maxActionPoints: 6,
      path: [],
      ...playerStartPositionMap[idx]
    })),
    mapUnits: [
      {
        type: UNIT_TYPES.TREE,
        name: "Tree",
        fallen: false,
        path: [],
        x: 2,
        y: 2
      },
      {
        type: UNIT_TYPES.TREE,
        name: "Tree",
        fallen: false,
        path: [],
        x: 9,
        y: 2
      },
      {
        type: UNIT_TYPES.TREE,
        name: "Tree",
        fallen: false,
        path: [],
        x: 2,
        y: 9
      },
      {
        type: UNIT_TYPES.TREE,
        name: "Tree",
        fallen: false,
        path: [],
        x: 9,
        y: 9
      }
    ]
  }),
  moves: {
    clickCell: (G, ctx, x, y) => {
      if (ctx.playerID !== null) {
        const { actionPoints, x: playerX, y: playerY } = G.playerUnits[ctx.playerID];
        const path = getPath(G, playerX, playerY, x, y);
        if (path && actionPoints >= path.slice(1).length) {
          G.playerUnits[ctx.playerID].path = path;
          G.playerUnits[ctx.playerID].x = x;
          G.playerUnits[ctx.playerID].y = y;
          ctx.events.endTurn();
        }
      }
    }
  },
  endIf: (G, ctx) => {
    /* if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    } */
  }
};
