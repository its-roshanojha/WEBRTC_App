import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
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
    // STEP:3 => Also create an offer and send this offer to reciver so that he can get an incomming call
      const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
      }, [remoteSocketId, socket]);

    //   STEP:4 => Handling Incomming call. started a stream and logging the data i.e offer
    //   STEP:5 => Setting the remote Description using get answer and the offer as arg. 
    const handleIncommingCall = useCallback(
        async ({ from, offer }) => {
          setRemoteSocketId(from);
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          setMyStream(stream);
          console.log(`Incoming Call`, from, offer);
          const ans = await peer.getAnswer(offer);
          socket.emit("call:accepted", { to: from, ans });
        },
        [socket]
      );

     //   STEP 7 =>SEND STREAM AFTER CALL ACCEPTED. Peer.Peer will send the stream to different user
    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
          peer.peer.addTrack(track, myStream);
        }
     }, [myStream]);

    //  STEP:6 => Call:Accepted 
    const handleCallAccepted = useCallback(
        ({ from, ans }) => {
          peer.setLocalDescription(ans);
          console.log("Call Accepted!");
          sendStreams();
        },
        [sendStreams]
      );

    //   STEP:9 => Before Negotiation we need to de-register the event listerner for sending streams and also for negotiation we are sending offer again
     const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
      }, [remoteSocketId, socket]);

    //   STEP:9 (only)
      useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
          peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
      }, [handleNegoNeeded]);

      const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
          const ans = await peer.getAnswer(offer);
          socket.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
      );

      const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans);
      }, []);

    //   STEP:8 => Jab dusre user ke paas  track chala jayga to usse listener se handle karne ke liye\
    // WE ARE SENDING THE STREAM BUT A NEGOTIATION NEEDED. Basically ye dono ko aapas me re-connect karna ha.
      useEffect(() => {
        peer.peer.addEventListener("track", async (e) => {
          const remoteStream = e.streams;
          console.log("GOT TRACKS!!");
          setRemoteStream(remoteStream[0]);
        });
      }, []);

    
    // Everything is initialising from here 
        useEffect(() => {
            socket.on("user:joined", handleUserJoined);
            socket.on("incomming:call", handleIncommingCall);
            socket.on("call:accepted", handleCallAccepted);
    // STEP:10 => Handling the peer connection offer and sending an answe 
            socket.on("peer:nego:needed", handleNegoNeedIncomming);
    // STEP: 11 => Setting the answer in local description
            socket.on("peer:nego:final", handleNegoNeedFinal);

    

            return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incomming:call", handleIncommingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.off("peer:nego:final", handleNegoNeedFinal);


            };
        }, [
            socket,
            handleUserJoined,
            handleIncommingCall,
            handleCallAccepted,
            handleNegoNeedIncomming,
            handleNegoNeedFinal
        ]);


  return (
    <>
         <div>
      <h1>Room Page</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {/* STEP:12 => Now our connection is done but aur send stream is not working so we will send the stream again with the help of button */}
      {myStream && <button onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="200px"
            width="400px"
            url={myStream}
          />
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="200px"
            width="400px"
            url={remoteStream}
          />
        </>
      )}
    </div>
    </>
    
    
  )
}

export default Room