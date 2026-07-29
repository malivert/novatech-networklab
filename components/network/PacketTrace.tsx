"use client";

import { CircleCheck, CircleX, Play } from "lucide-react";
import { useState } from "react";
import type { Scenario } from "@/types/network";

interface PacketTraceProps {
  scenario: Scenario;
  corrected: boolean;
  onInspectBlockedDevice: () => void;
  onValidated: () => void;
}

export function PacketTrace({
  scenario,
  corrected,
  onInspectBlockedDevice,
  onValidated,
}: PacketTraceProps) {
  const [testState, setTestState] = useState<"idle" | "running" | "success" | "blocked">("idle");
  const route = ["Poste", "Switch", "Routeur", "Pare-feu", scenario.packetDestination];
  const blockedIndex =
    scenario.packetStopDeviceId === "pc-dir"
      ? 0
      : scenario.packetStopDeviceId === "sw-core" || scenario.packetStopDeviceId === "ap-01"
        ? 1
        : scenario.packetStopDeviceId === "rtr-01"
          ? 2
          : scenario.packetStopDeviceId === "fw-01"
            ? 3
            : 4;

  function runTest() {
    setTestState("running");
    window.setTimeout(() => {
      const next = corrected ? "success" : "blocked";
      setTestState(next);
      if (next === "success") onValidated();
    }, 1250);
  }

  return (
    <section className="packet-card">
      <div className="section-heading compact">
        <div>
          <span className="eyebrow">ANALYSE VISUELLE</span>
          <h3>Trajet du paquet</h3>
        </div>
        <button className="secondary-button" type="button" onClick={runTest} disabled={testState === "running"}>
          <Play size={16} />
          {testState === "running" ? "Test en cours…" : "Tester le trajet du paquet"}
        </button>
      </div>

      <div className={`packet-route ${testState}`}>
        {route.map((step, index) => {
          const blocked = testState === "blocked" && index === blockedIndex;
          const reached = testState === "success" || (testState === "blocked" && index <= blockedIndex);
          return (
            <div className={`packet-step ${blocked ? "blocked" : ""} ${reached ? "reached" : ""}`} key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          );
        })}
      </div>

      {testState === "blocked" && (
        <div className="inline-alert warning">
          <CircleX size={18} />
          <span>Le paquet est bloqué avant sa destination.</span>
          <button type="button" onClick={onInspectBlockedDevice}>
            Examiner l’équipement
          </button>
        </div>
      )}
      {testState === "success" && (
        <div className="inline-alert success">
          <CircleCheck size={18} />
          <span>Service validé : le paquet atteint sa destination.</span>
        </div>
      )}
    </section>
  );
}

