import { describe, expect, it } from "vitest";
import { scenarios } from "@/data/scenarios";

describe("catalogue de scénarios", () => {
  it("charge exactement six scénarios uniques et complets", () => {
    expect(scenarios).toHaveLength(6);
    expect(new Set(scenarios.map((scenario) => scenario.id)).size).toBe(6);

    for (const scenario of scenarios) {
      expect(scenario.hints).toHaveLength(3);
      expect(scenario.actions.some((action) => action.id === scenario.correctActionId)).toBe(true);
      expect(scenario.logs.length).toBeGreaterThanOrEqual(4);
      expect(scenario.expectedCommands.length).toBeGreaterThanOrEqual(3);
      expect(scenario.prevention.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("couvre les trois niveaux de difficulté", () => {
    expect(new Set(scenarios.map((scenario) => scenario.difficulty))).toEqual(
      new Set(["Débutant", "Intermédiaire", "Avancé"]),
    );
  });
});

