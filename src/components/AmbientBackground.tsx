import React from "react";

export function AmbientBackground() {
  return (
    <>
      <div className="ambient-mesh" aria-hidden="true" />
      <div className="ambient-warm" aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />
    </>
  );
}
