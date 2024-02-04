import Button from "@/components/Button";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { Input } from "@/components/Input";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1  items-center justify-center  h-full w-full mx-auto">
        <Container>
          <div className="bg-secondary max-w-[580px] w-full p-4 rounded-lg">
            <div>
              <span>Ingressar</span>
              <span>Nova reunião</span>
            </div>
            <div className="space-y-4">
              <Input placeholder="Digite o código da reunião" type="text" />
              <Input placeholder="Digite o código da reunião" type="text" />

              <Button title="Entrar" type="submit" />
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
