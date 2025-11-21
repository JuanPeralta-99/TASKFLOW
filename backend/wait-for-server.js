// backend/wait-for-server.js
import fetch from "node-fetch";

const url = "http://localhost:3000/tasks"; // endpoint que queremos chequear
const interval = 1000; // cada 1 segundo
const timeout = 120000; // máximo 2 minutos

const start = Date.now();

async function waitForServer() {
  while (true) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log("Backend listo!");
        process.exit(0);
      }
    } catch (err) {
      // Backend aún no responde
    }

    if (Date.now() - start > timeout) {
      console.error(`Timeout: el backend no respondió en ${timeout}ms`);
      process.exit(1);
    }

    await new Promise((r) => setTimeout(r, interval));
  }
}

waitForServer();
