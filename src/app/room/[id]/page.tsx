"use client";
import { SocketContext } from "@/contexts/SocketContext";
import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useContext, useEffect, useRef } from "react";

export default function Room({ params }: { params: { id: string } }) {
  const { socket } = useContext(SocketContext);
  const localStream = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

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
    socket?.on("sdp", async (data) => {
      console.log("SDP", data);
    });
  }, [socket]);

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

    if (createOffer) {
      const peerConnection = peerConnections.current[socketId];

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket?.emit("sdp", {
        to: socketId,
        description: peerConnection.localDescription,
      });
    }
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
