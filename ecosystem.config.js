module.exports = [
  {
    script: "serve",
    name: "client",
    env: {
      PM2_SERVE_PATH: "./build",
      PM2_SERVE_PORT: 3000,
      PM2_SERVE_SPA: "true"
    }
  },
  {
    script: "./src/server_index.js",
    name: "server"
  }
];
