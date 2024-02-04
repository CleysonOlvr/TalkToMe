import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Room({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <div>
        <h1>Room</h1>
      </div>
      <Footer />
    </>
  );
}
