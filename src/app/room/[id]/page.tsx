"use client";
import { SocketContext } from "@/contexts/SocketContext";
import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useContext, useEffect, useRef } from "react";

export default function Room({ params }: { params: { id: string } }) {
  const { socket } = useContext(SocketContext);
  const localStream = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    socket?.on("connection", async () => {
      console.log("Connected to server");
      socket?.emit("subscribe", {
        roomId: params.id,
        socketId: socket.id,
      });
      await initCamera();
    });
  }, [socket]);

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
                className="h-full w-full"
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
