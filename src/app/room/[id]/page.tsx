"use client";
import { SocketContext } from "@/contexts/SocketContext";
import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useContext, useEffect, useRef, useState } from "react";

interface IAnswer {
  sender: string;
  description: RTCSessionDescriptionInit;
}

interface ICandidates {
  sender: string;
  candidate: RTCIceCandidate;
}

export default function Room({ params }: { params: { id: string } }) {
  const { socket } = useContext(SocketContext);
  const localStream = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    socket?.on("connection", async () => {
      console.log("Connected to server");
      socket?.emit("subscribe", {
        roomId: params.id,
        socketId: socket.id,
      });
      await initCamera();
    });

    socket?.on("newUserStart", (data) => {
      console.log("Novo usuário conectado", data);
      createPeerConnection(data.sender, true);
    });

    socket?.on("new user", (data) => {
      console.log("Novo usuário conectado", data);
      createPeerConnection(data.socketId, false);
      socket.emit("newUserStart", { to: data.socketId, sender: socket.id });
    });

    socket?.on("sdp", async (data) => handleAnswer(data));

    socket?.on("ice candidates", (data) => handleIceCandidates(data));
  }, [socket]);

  const handleIceCandidates = async (data: ICandidates) => {
    const peerConnection = peerConnections.current[data.sender];
    if (data.candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  const handleAnswer = async (data: IAnswer) => {
    const peerConnection = peerConnections.current[data.sender];

    if (data.description.type === "offer") {
      await peerConnection.setRemoteDescription(data.description);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket?.emit("sdp", {
        to: data.sender,
        sender: socket?.id,
        description: peerConnection.localDescription,
      });
    } else if (data.description.type === "answer") {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.description)
      );
    }
  };

  const createPeerConnection = async (
    socketId: string,
    createOffer: boolean
  ) => {
    const config = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };

    const peer = new RTCPeerConnection(config);
    peerConnections.current[socketId] = peer;
    const peerConnection = peerConnections.current[socketId];

    if (createOffer) {
      const peerConnection = peerConnections.current[socketId];

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket?.emit("sdp", {
        to: socketId,
        description: peerConnection.localDescription,
      });
    }

    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];

      setRemoteStream(remoteStream);
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice candidates", {
          to: socketId,
          sender: socket?.id,
          candidate: event.candidate,
        });
      }
    };
  };

  const initCamera = async () => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
      },
    });
    if (localStream.current) localStream.current.srcObject = video;
  };

  return (
    <div className="h-screen">
      <Header />
      <div className="flex h-[80%]">
        <div className="md:w-[85%] w-full m-3">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
            <div className="bg-gray-950 w-full h-full rounded-md p-2 relative">
              <video
                className="h-full w-full mirror-mode"
                autoPlay
                ref={localStream}
              ></video>
              <span className="absolute bottom-3">Cleyson Oliveira</span>
            </div>
            <div className="bg-gray-950 w-full h-full rounded-md p-2 relative">
              <video className="h-full w-full"></video>
              <span className="absolute bottom-3">Cleyson Oliveira</span>
            </div>
          </div>
        </div>
        <Chat roomId={params.id} />
      </div>
      <Footer />
    </div>
  );
}
