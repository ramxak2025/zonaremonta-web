import("./hosting/server.mjs").catch(error => { console.error(error.message); process.exitCode = 1; });
