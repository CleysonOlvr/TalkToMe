import { FormWrapper } from "@/components/FormWrapper";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1  items-center justify-center max-w-[580px] h-full w-full mx-auto">
        <FormWrapper />
      </div>
    </main>
  );
}
