import { describe, expect, it } from "vitest";
import { networkCourses } from "@/data/courses";
import { networkDevices } from "@/data/network";
import { scenarios } from "@/data/scenarios";
import { STATIC_VIEW_SEGMENTS, VIEW_ROUTES } from "@/lib/navigation";
import { executeCommand } from "@/lib/terminal";

describe("garde-fous d’extension", () => {
  it("génère toutes les routes de navigation depuis une source unique", () => {
    const routes = Object.values(VIEW_ROUTES);

    expect(new Set(routes).size).toBe(routes.length);
    expect(STATIC_VIEW_SEGMENTS).toEqual(routes.filter((route) => route !== "/").map((route) => route.slice(1)));
  });

  it("référence uniquement des équipements existants", () => {
    const deviceIds = new Set(networkDevices.map((device) => device.id));

    for (const device of networkDevices) {
      expect(device.connections.every((connectionId) => deviceIds.has(connectionId))).toBe(true);
    }

    for (const scenario of scenarios) {
      const referencedIds = [
        scenario.workstationId,
        scenario.packetStopDeviceId,
        ...scenario.affectedDeviceIds,
      ];
      expect(referencedIds.every((deviceId) => deviceIds.has(deviceId))).toBe(true);
    }
  });

  it("maintient des identifiants et relations uniques quand du contenu est ajouté", () => {
    const actionIds = scenarios.flatMap((scenario) =>
      scenario.actions.map((action) => `${scenario.id}:${action.id}`),
    );
    const questionIds = networkCourses.flatMap((course) =>
      course.quiz.map((question) => question.id),
    );
    const courseNumbers = networkCourses.map((course) => course.number);

    expect(new Set(actionIds).size).toBe(actionIds.length);
    expect(new Set(questionIds).size).toBe(questionIds.length);
    expect(new Set(courseNumbers).size).toBe(courseNumbers.length);
  });

  it("reconnaît chaque commande attendue par les nouveaux scénarios", () => {
    for (const scenario of scenarios) {
      for (const command of scenario.expectedCommands) {
        expect(
          executeCommand(command, { scenario, corrected: false }).useful,
          `${scenario.id}: ${command}`,
        ).toBe(true);
      }
    }
  });
});
