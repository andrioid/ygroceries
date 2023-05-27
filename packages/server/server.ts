import ws from "ws";
import http from "http";
import { setupWSConnection } from "y-websocket/bin/utils";
const wss = new ws.Server({ noServer: true });

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 1234;

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("okay");
});

wss.on("connection", setupWSConnection);

server.on("upgrade", (request, socket, head) => {
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {any} ws
   */
  const handleAuth: Parameters<typeof wss.handleUpgrade>[3] = (ws) => {
    wss.emit("connection", ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen(port, () => {
  console.log(`running on port ${port}`);
});
