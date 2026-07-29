import { describe, expect, it } from "vitest";
import { calculateScore } from "@/lib/scoring";
import type { ActionRecord, CommandRecord } from "@/types/network";

const command = (value: string, useful = true): CommandRecord => ({
  command: value,
  output: "sortie",
  useful,
  timestamp: "2026-07-29T10:00:00.000Z",
});

const action = (correct: boolean): ActionRecord => ({
  actionId: correct ? "set-dns" : "restart-switch",
  label: correct ? "Configurer le DNS" : "Redémarrer le switch",
  correct,
  timestamp: "2026-07-29T10:01:00.000Z",
});

describe("calcul du score", () => {
  it("récompense une méthode logique, la correction et la validation", () => {
    const score = calculateScore({
      commands: [command("ping 8.8.8.8"), command("nslookup intranet.novatech.local"), command("ipconfig /all")],
      actions: [action(true)],
      hintsUsed: 0,
      validated: true,
      durationSeconds: 95,
      expectedCommands: ["ping 8.8.8.8", "nslookup intranet.novatech.local", "ipconfig /all"],
    });
    expect(score.total).toBe(100);
  });

  it("pénalise les indices, répétitions et mauvaises corrections", () => {
    const score = calculateScore({
      commands: [command("ping 8.8.8.8"), command("ping 8.8.8.8")],
      actions: [action(false), action(true)],
      hintsUsed: 2,
      validated: false,
      durationSeconds: 500,
      expectedCommands: ["ping 8.8.8.8", "nslookup intranet.novatech.local", "ipconfig /all"],
    });
    expect(score.penalties).toBeGreaterThanOrEqual(17);
    expect(score.total).toBeLessThan(70);
  });

  it("borne toujours le résultat entre 0 et 100", () => {
    const score = calculateScore({
      commands: [],
      actions: Array.from({ length: 10 }, () => action(false)),
      hintsUsed: 3,
      validated: false,
      durationSeconds: 2000,
      expectedCommands: ["ping 8.8.8.8"],
    });
    expect(score.total).toBe(0);
  });
});

