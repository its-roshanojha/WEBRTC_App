import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../context/SocketProvider";


const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();


    // STEP:1 => Handle the user joined
    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
      }, []);

    // STEP:2 => Trigger this function when user clicks call. On the stream and emit an event user call
      const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        // const offer = await peer.getOffer();
        // socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
      }, [remoteSocketId, socket]);

        useEffect(() => {
            socket.on("user:joined", handleUserJoined);
            // socket.on("incomming:call", handleIncommingCall);

            return () => {
            socket.off("user:joined", handleUserJoined);
            // socket.off("incomming:call", handleIncommingCall);

            };
        }, [
            socket,
            handleUserJoined,
            // handleIncommingCall,

        ]);


  return (
    <>
        <div>Room</div>
        <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
        {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
        {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={myStream}
          />
        </>
      )}

    </>
    
    
  )
}

export default Room