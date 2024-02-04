"use client";
import { Input } from "./Input";
import Button from "./Button";
import { useRef } from "react";

export function Create() {
  const name = useRef<HTMLInputElement>(null);

  return (
    <>
      <Input placeholder="Seu nome" type="text" ref={name} />
      <Button title="Entrar" type="submit" />
    </>
  );
}
