module.exports = {
  apps: [{
    name: "attestatsiya",
    script: "server/index.mjs",
    cwd: "/var/www/Attestatsiya-Robbit",
    env: { NODE_ENV: "production" },
  }],
};
