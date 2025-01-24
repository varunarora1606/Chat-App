import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });
const sockets = new Map<WebSocket, string>();

wss.on("connection", (socket) => {
  console.log("connection established");
  socket.on("message", (e) => {
    const { type, payload } = JSON.parse(e.toString());
    switch (type) {

      case "join":
        sockets.set(socket, payload.roomId);
        socket.send("Room joined");
        break;

      case "chat":
        const currentRoom = sockets.get(socket)
        sockets.forEach((roomId, ws) => {
            if(currentRoom === roomId) {
                ws.send(payload.message);
            }
        })
        break;

      default:
        break;
    }
  });

  socket.on("close", () => {
    sockets.delete(socket);
  })
});

