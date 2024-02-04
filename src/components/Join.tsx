"use client";
import { Input } from "./Input";
import Button from "./Button";
import { useRef } from "react";

export function Join() {
  const name = useRef<HTMLInputElement>(null);
  const id = useRef<HTMLInputElement>(null);

  return (
    <>
      <Input placeholder="Seu nome" type="text" ref={name} />
      <Input placeholder="Id da reunião" type="text" ref={id} />

      <Button title="Entrar" type="submit" />
    </>
  );
}
