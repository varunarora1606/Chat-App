import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 3000});
WebSocket
wss.on('connection', (socket) => {
    console.log("connection established")
    socket.on("open", () => {
        socket.send("open");
    })
    socket.on("message", (e) => {
        wss.clients.forEach((client) => {
            if(client !== socket){
                client.send(e.toString())
            }
        })
    })
})
