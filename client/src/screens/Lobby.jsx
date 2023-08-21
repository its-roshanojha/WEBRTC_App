import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const Lobby = () => {
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");
  
    const socket = useSocket();
    const navigate = useNavigate();
  
    const handleSubmitForm = useCallback(
      (e) => {
        e.preventDefault();
        socket.emit("room:join", { email, room });
      },
      [email, room, socket]
    );
  
    const handleJoinRoom = useCallback(
      (data) => {
        const { email, room } = data;
        console.log("JOINING THE ROOM FROM BE=>",{email, room})
        navigate(`/room/${room}`);
      },
      [navigate]
    );
  
    useEffect(() => {
      socket.on("room:join", handleJoinRoom);
      return () => {
        socket.off("room:join", handleJoinRoom);
      };
    }, [socket, handleJoinRoom]);

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
