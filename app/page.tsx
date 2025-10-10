import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
      </main>
    </>
  );
}
