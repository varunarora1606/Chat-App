import express from "express";
import { WebSocket, WebSocketServer } from "ws";

const app = express();
const httpServer = app.listen(3000);
const wss = new WebSocketServer({ server: httpServer });
const sockets = new Map<WebSocket, string>();

wss.on("connection", (socket) => {
  console.log("connection established");
  socket.on("message", (e) => {
    const { type, payload } = JSON.parse(e.toString());
    switch (type) {
      case "join":
        sockets.set(socket, payload.roomId);
        sockets.forEach((roomId, ws) => {
          if (payload.roomId === roomId) {
            ws.send(
              {
                roomId: payload.roomId,
                username: payload.username,
                message: "Room joined",
              }.toString()
            );
          }
        });
        break;

      case "chat":
        const currentRoom = sockets.get(socket);
        sockets.forEach((roomId, ws) => {
          if (currentRoom === roomId) {
            ws.send(
              {
                roomId: payload.roomId,
                username: payload.username,
                message: payload.message,
              }.toString()
            );
          }
        });
        break;

      default:
        break;
    }
  });

  socket.on("close", () => {
    sockets.delete(socket);
  });
});
