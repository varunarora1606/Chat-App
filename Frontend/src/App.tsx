import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const roomIdRef = useRef<HTMLInputElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const handleJoinRoom = () => {
    if(socket && roomIdRef.current){
      socket.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: roomIdRef.current.value
        }
      }));
    }
  };
  const handleClick = () => {
    if(socket && inputRef.current) {
      socket.send(JSON.stringify({
        type: "chat",
        payload: {
          message: inputRef.current.value
        }
      }));
    }
  };
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    ws.onmessage = (event) => {
      setMessages((m: string[]) => [...m, event.data]);
    };
    setSocket(ws);

    return () => ws.close()
  }, []);

  return (
    <>
      <input ref={roomIdRef} type="text" placeholder="message..." />
      <button onClick={handleJoinRoom}>Join Room</button>
      <div>
        {messages.map((message, index) => {
          return <div key={index}>{message}</div>;
        })}
      </div>
      <input ref={inputRef} type="text" placeholder="message..." />
      <button onClick={handleClick}>Send</button>
    </>
  );
}

export default App;
