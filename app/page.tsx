import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import WhatIsBreakout from "@/components/sections/WhatIsBreakout";
import Stats from "@/components/sections/Stats";
import Events from "@/components/sections/Events";
import Community from "@/components/sections/Community";
import JoinCommunity from "@/components/sections/JoinCommunity";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <WhatIsBreakout />
        <Stats />
        <Events />
        <Community />
        <JoinCommunity />
      </main>
    </>
  );
}
