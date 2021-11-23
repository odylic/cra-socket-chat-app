import TextField from "@material-ui/core/TextField";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";

function App() {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");
    // should set the chat with the new message
    socketRef.current.on("message", ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
    return () => socketRef.current.disconnect();
  });

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    // deconstructs state.name and state.message
    const { name, message } = state;
    // emit's the message to the websocket server
    socketRef.current.emit("message", { name, message });
    e.preventDefault();
    // this is to reset state
    setState({ message: "", name });
  };

  const renderChat = () => {
    console.log(state);
    console.log("chat:", chat);
    // return chat.map(({ name, message }, index) => (
    //   <div key={index}>
    //     <h3>
    //       {name}: <span>{message}</span>
    //     </h3>
    //   </div>
    // ));
    return (
      <h3>
        {chat.name}: {chat.message}
      </h3>
    );
  };

  return (
    <div className="card">
      <form onSubmit={onMessageSubmit}>
        <h1>Messenger</h1>
        <div className="name-field">
          <TextField
            name="name"
            onChange={(e) => onTextChange(e)}
            value={state.name}
            label="Name"
          />
        </div>
        <div>
          <TextField
            name="message"
            onChange={(e) => onTextChange(e)}
            value={state.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
          />
        </div>
        <button>Send Message</button>
      </form>
      <div className="render-chat">
        <h1>Chat Log</h1>
        {renderChat()}
        This is where chat should render
      </div>
    </div>
  );
}

export default App;
