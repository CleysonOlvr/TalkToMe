"use client";
import { SocketContext } from "@/contexts/SocketContext";
import Image from "next/image";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";

interface IChatMessage {
  message: string;
  username: string;
  roomId: string;
  time: string;
}

export default function Chat({ roomId }: { roomId: string }) {
  const currentMessage = useRef<HTMLInputElement>(null);
  const { socket } = useContext(SocketContext);
  const [chat, setChat] = useState<IChatMessage[]>([]);
  useEffect(() => {
    socket?.on("chat", (data) => {
      console.log(data);
      setChat((prev) => [...prev, data]);
    });
  }, [socket]);

  function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (currentMessage.current && currentMessage.current?.value !== "") {
      const sendMessageToServer = {
        message: currentMessage.current.value,
        username: "Cleyson Oliveira",
        roomId,
        time: new Date().toLocaleTimeString(),
      };

      socket?.emit("chat", sendMessageToServer);
      setChat((prev) => [...prev, sendMessageToServer]);

      currentMessage.current.value = "";
    }
  }

  return (
    <div className="bg-gray-900 relative min-h-[70vh] px-4 pt-4 w-[15%] hidden md:flex rounded-md m-3">
      <div className="h-full w-full">
        {chat.map((chat, index) => {
          return (
            <div className="bg-gray-950 rounded p-2 mb-4" key={index}>
              <div className="flex items-center text-pink-400 space-x-2">
                <span>{chat.username}</span>
                <span>{chat.time}</span>
              </div>
              <div className="mt-5 text-sm">
                <p>{chat.message}</p>
              </div>
            </div>
          );
        })}

        <form
          className="absolute bottom-4 inset-x-3"
          onSubmit={(e) => sendMessage(e)}
        >
          <div className="flex relative">
            <input
              type="text"
              name=""
              id=""
              ref={currentMessage}
              className="px-3 py-2 bg-gray-950 rounded-md w-full"
            />
            <button type="submit">
              <Image
                className="absolute right-2 top-2.5 cursor-pointer"
                src="/send.png"
                alt="Enviar mensagem"
                width={20}
                height={20}
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
