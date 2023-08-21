import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../context/SocketProvider";


const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();


    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
      }, []);

        useEffect(() => {
            socket.on("user:joined", handleUserJoined);

            return () => {
            socket.off("user:joined", handleUserJoined);
            };
        }, [
            socket,
            handleUserJoined,
        ]);


  return (
    <>
        <div>Room</div>
        <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>

    </>
    
    
  )
}

export default Room