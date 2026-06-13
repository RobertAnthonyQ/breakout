import Header from "@/components/layout/header"
import Hero from "@/components/sections/hero"
import WhatIsBreakout from "@/components/sections/what-is-breakout"
import Stats from "@/components/sections/stats"
import Events from "@/components/sections/events"
import Community from "@/components/sections/community"
import JoinCommunity from "@/components/sections/join-community"

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
  )
}
