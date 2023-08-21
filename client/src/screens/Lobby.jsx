import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SocketProvider, useSocket } from "../context/SocketProvider";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const navigate = useNavigate();
  const socket = useSocket();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    }
     , [email, room, socket]
  );

  return (
    <div className="pt-3">
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <div className="mb-3">
          <label className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">
          Room Number
         </label>
          <input
            className="form-control"
            id="exampleInputPassword1"
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          ENTER THE ROOM
        </button>
      </form>
      
    </div>
  );
};

export default Lobby;
