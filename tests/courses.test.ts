import { describe, expect, it } from "vitest";
import { networkCourses } from "@/data/courses";
import { scenarios } from "@/data/scenarios";

describe("parcours de cours réseau", () => {
  it("propose huit modules uniques et complets", () => {
    expect(networkCourses).toHaveLength(8);
    expect(new Set(networkCourses.map((course) => course.id)).size).toBe(8);

    for (const course of networkCourses) {
      expect(course.objectives.length).toBeGreaterThanOrEqual(3);
      expect(course.sections.length).toBeGreaterThanOrEqual(3);
      expect(course.quiz).toHaveLength(3);
    }
  });

  it("contient des quiz valides", () => {
    for (const course of networkCourses) {
      for (const question of course.quiz) {
        expect(question.options.length).toBeGreaterThanOrEqual(3);
        expect(question.answerIndex).toBeGreaterThanOrEqual(0);
        expect(question.answerIndex).toBeLessThan(question.options.length);
        expect(question.explanation.length).toBeGreaterThan(20);
      }
    }
  });

  it("relie chaque cours à un défi existant", () => {
    const scenarioIds = new Set(scenarios.map((scenario) => scenario.id));
    expect(networkCourses.every((course) => scenarioIds.has(course.scenarioId))).toBe(true);
  });
});
