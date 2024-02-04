"use client";

import { useState } from "react";
import Button from "./Button";
import { Input } from "./Input";
import { Join } from "./Join";
import { Create } from "./Create";

export function FormWrapper() {
  const [selectedRoom, setSelectedRoom] = useState<"join" | "create">("join");
  const handleSelectedRoom = (room: "join" | "create") => {
    setSelectedRoom(room);
  };

  return (
    <div className="w-full p-4 rounded-lg">
      <div className="flex items-center text-center">
        <span
          className={`w-1/2 p-4 cursor-pointer ${
            selectedRoom === "join" && "rounded-t-lg text-primary bg-secondary"
          }`}
          onClick={() => handleSelectedRoom("join")}
        >
          Ingressar
        </span>
        <span
          className={`w-1/2 p-4 cursor-pointer ${
            selectedRoom === "create" &&
            "rounded-t-lg text-primary bg-secondary"
          }`}
          onClick={() => handleSelectedRoom("create")}
        >
          Nova reunião
        </span>
      </div>
      <div className="space-y-8 p-10 rounded-b-lg bg-secondary">
        <RoomSelector selectedRoom={selectedRoom} />
      </div>
    </div>
  );
}

const RoomSelector = ({
  selectedRoom,
}: {
  selectedRoom: "join" | "create";
}) => {
  switch (selectedRoom) {
    case "join":
      return <Join />;

    case "create":
      return <Create />;

    default:
      return <Join />;
  }
};
