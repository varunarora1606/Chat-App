import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const inputRef = useRef()
  const [socket, setSocket] = useState()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  
  const handleClick = () => {
    socket.send(inputRef.current.value);
  }
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000")
    ws.onmessage = (event) => {
      setMessage(event.data)
    }
    setSocket(ws)
  },[])

  useEffect(() => {
    setMessages([...messages, message])
    setMessage("")
  },[message])

  return (
    <>
      <div>
        {messages.map((message, index) => {
          return <div key={index}>
            {message}
          </div>
        })}
      </div>
      <input ref={inputRef} type="text" placeholder='message...'/>
      <button onClick={handleClick}>Send</button>
    </>
  )
}

export default App
