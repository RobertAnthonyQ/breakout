import React from "react";
import { getOpportunities, getOpportunityStats } from "../src/lib/opportunities";
import { OpportunitiesClient } from "../src/components/OpportunitiesClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [opportunities, stats] = await Promise.all([
    getOpportunities(),
    getOpportunityStats(),
  ]);

  return (
    <OpportunitiesClient
      initialOpportunities={opportunities}
      stats={stats}
    />
  );
}
