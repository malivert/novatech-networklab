import { describe, expect, it } from "vitest";
import {
  STORAGE_KEY,
  defaultProgress,
  mergeCourseProgress,
  mergeScenarioProgress,
  readProgress,
  writeProgress,
} from "@/lib/storage";

describe("stockage local", () => {
  it("lit et écrit une progression valide", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
    expect(writeProgress({ scenarios: [], courses: [], theme: "light" }, storage)).toBe(true);
    expect(values.has(STORAGE_KEY)).toBe(true);
    expect(readProgress(storage).theme).toBe("light");
  });

  it("retourne une valeur sûre en cas de JSON invalide", () => {
    const storage = { getItem: () => "{invalide" };
    expect(readProgress(storage)).toEqual(defaultProgress);
  });

  it("gère une erreur d’écriture sans la propager", () => {
    const storage = {
      setItem: () => {
        throw new Error("quota");
      },
    };
    expect(writeProgress(defaultProgress, storage)).toBe(false);
  });

  it("conserve le meilleur score et incrémente les tentatives", () => {
    const first = mergeScenarioProgress(defaultProgress, {
      scenarioId: "dns-incorrect",
      bestScore: 92,
      completed: true,
      bestDurationSeconds: 120,
      attempts: 1,
    });
    const second = mergeScenarioProgress(first, {
      scenarioId: "dns-incorrect",
      bestScore: 75,
      completed: true,
      bestDurationSeconds: 180,
      attempts: 2,
    });
    expect(second.scenarios[0].bestScore).toBe(92);
    expect(second.scenarios[0].bestDurationSeconds).toBe(120);
    expect(second.scenarios[0].attempts).toBe(2);
  });

  it("conserve le meilleur quiz et la validation d’un cours", () => {
    const first = mergeCourseProgress(defaultProgress, {
      courseId: "dns",
      bestScore: 100,
      completed: true,
      attempts: 1,
    });
    const second = mergeCourseProgress(first, {
      courseId: "dns",
      bestScore: 33,
      completed: false,
      attempts: 2,
    });
    expect(second.courses[0].bestScore).toBe(100);
    expect(second.courses[0].completed).toBe(true);
    expect(second.courses[0].attempts).toBe(2);
  });
});
