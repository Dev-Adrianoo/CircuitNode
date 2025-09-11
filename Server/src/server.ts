import gracefulShutDown from "shared/graceful_shutdown";
import * as http from "http";
import app from "app";
const PORT = 3000;

async function startServer() {

  const server = http.createServer(app);
  server.listen(PORT, () => {
     console.log(`FURACÃO ${PORT}`)
  });

}
process.on("SIGINT", gracefulShutDown);
process.on("SIGTERM", gracefulShutDown);
