import { describe, expect, it } from "vitest";
import { getScenario } from "@/data/scenarios";
import { executeCommand } from "@/lib/terminal";

describe("moteur du terminal", () => {
  it("sépare connectivité IP et DNS dans le scénario DNS", () => {
    const scenario = getScenario("dns-incorrect");
    expect(executeCommand("ping 8.8.8.8", { scenario, corrected: false }).output).toContain("perte 0%");
    expect(
      executeCommand("nslookup intranet.novatech.local", { scenario, corrected: false }).output,
    ).toContain("délai");
  });

  it("rétablit la résolution après la correction DNS", () => {
    const scenario = getScenario("dns-incorrect");
    const result = executeCommand("nslookup intranet.novatech.local", {
      scenario,
      corrected: true,
    });
    expect(result.output).toContain("10.50.0.10");
    expect(result.output).toContain("10.50.0.20");
  });

  it("affiche une adresse APIPA quand l’étendue DHCP est épuisée", () => {
    const scenario = getScenario("dhcp-exhausted");
    expect(executeCommand("ipconfig", { scenario, corrected: false }).output).toContain("169.254.77.14");
    expect(executeCommand("ipconfig /renew", { scenario, corrected: false }).output).toContain(
      "impossible de contacter",
    );
    expect(executeCommand("ipconfig /renew", { scenario, corrected: true }).output).toContain(
      "10.60.0.104",
    );
  });

  it("distingue ping et port TCP pour la panne pare-feu", () => {
    const scenario = getScenario("firewall-block");
    expect(executeCommand("ping 10.50.0.20", { scenario, corrected: false }).output).toContain(
      "perte 0%",
    );
    expect(
      executeCommand("Test-NetConnection 10.50.0.20 -Port 445", {
        scenario,
        corrected: false,
      }).output,
    ).toContain("False");
    expect(
      executeCommand("Test-NetConnection 10.50.0.20 -Port 445", {
        scenario,
        corrected: true,
      }).output,
    ).toContain("True");
  });

  it("signale les informations ARP incohérentes", () => {
    const scenario = getScenario("ip-conflict");
    expect(executeCommand("arp -a", { scenario, corrected: false }).output).toContain(
      "également annoncé",
    );
  });

  it("refuse une commande inconnue sans casser la session", () => {
    const scenario = getScenario("gateway-error");
    expect(executeCommand("format c:", { scenario, corrected: false })).toMatchObject({
      useful: false,
    });
  });
});

