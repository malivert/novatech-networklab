import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  addressingPlan,
  proofDocuments,
  resolvedDeviceAssignments,
} from "@/data/addressing";

function ipv4ToNumber(ip: string) {
  return ip
    .split(".")
    .map(Number)
    .reduce((total, octet) => total * 256 + octet, 0);
}

function belongsToNetwork(ip: string, cidr: string) {
  const [network, prefix] = cidr.split("/");
  const hostBits = 32 - Number(prefix);
  const blockSize = 2 ** hostBits;
  const networkNumber = ipv4ToNumber(network);
  const ipNumber = ipv4ToNumber(ip);

  return ipNumber >= networkNumber && ipNumber < networkNumber + blockSize;
}

describe("preuve technique d’adressage", () => {
  it("décrit six réseaux /24 uniques avec des bornes cohérentes", () => {
    expect(addressingPlan).toHaveLength(6);
    expect(new Set(addressingPlan.map((entry) => entry.vlanId)).size).toBe(6);
    expect(new Set(addressingPlan.map((entry) => entry.network)).size).toBe(6);

    for (const entry of addressingPlan) {
      const networkBase = entry.network.replace(".0/24", "");

      expect(entry.prefixLength).toBe(24);
      expect(entry.subnetMask).toBe("255.255.255.0");
      expect(entry.firstUsable).toBe(`${networkBase}.1`);
      expect(entry.gateway).toBe(entry.firstUsable);
      expect(entry.lastUsable).toBe(`${networkBase}.254`);
      expect(entry.broadcast).toBe(`${networkBase}.255`);
      expect(belongsToNetwork(entry.gateway, entry.network)).toBe(true);
    }
  });

  it("conserve chaque plage DHCP dans son réseau et hors de la passerelle", () => {
    for (const entry of addressingPlan) {
      if (!entry.dhcp) continue;

      expect(belongsToNetwork(entry.dhcp.start, entry.network)).toBe(true);
      expect(belongsToNetwork(entry.dhcp.end, entry.network)).toBe(true);
      expect(ipv4ToNumber(entry.dhcp.start)).toBeLessThanOrEqual(ipv4ToNumber(entry.dhcp.end));
      expect(ipv4ToNumber(entry.gateway)).toBeLessThan(ipv4ToNumber(entry.dhcp.start));
      expect(ipv4ToNumber(entry.dhcp.end)).toBeLessThan(ipv4ToNumber(entry.broadcast));
    }
  });

  it("place chaque équipement dans le VLAN et le mode d’attribution documentés", () => {
    expect(resolvedDeviceAssignments).toHaveLength(10);

    for (const assignment of resolvedDeviceAssignments) {
      const vlan = addressingPlan.find((entry) => entry.vlanId === assignment.vlanId);
      expect(vlan, assignment.device.name).toBeDefined();
      expect(belongsToNetwork(assignment.device.ip, vlan!.network)).toBe(true);
      expect(assignment.device.mask).toBe(vlan!.subnetMask);

      if (assignment.allocation === "DHCP") {
        expect(vlan!.dhcp, assignment.device.name).not.toBeNull();
        expect(ipv4ToNumber(assignment.device.ip)).toBeGreaterThanOrEqual(
          ipv4ToNumber(vlan!.dhcp!.start),
        );
        expect(ipv4ToNumber(assignment.device.ip)).toBeLessThanOrEqual(
          ipv4ToNumber(vlan!.dhcp!.end),
        );
      } else if (vlan!.dhcp) {
        const ip = ipv4ToNumber(assignment.device.ip);
        expect(
          ip >= ipv4ToNumber(vlan!.dhcp.start) && ip <= ipv4ToNumber(vlan!.dhcp.end),
          assignment.device.name,
        ).toBe(false);
      }
    }
  });

  it("publie les trois livrables et maintient les CSV cohérents avec l’application", () => {
    for (const document of proofDocuments) {
      expect(existsSync(join(process.cwd(), "public", document.href))).toBe(true);
    }

    const vlanCsv = readFileSync(
      join(process.cwd(), "public/preuves/plan-vlans-novatech.csv"),
      "utf8",
    );
    const inventoryCsv = readFileSync(
      join(process.cwd(), "public/preuves/inventaire-ip-novatech.csv"),
      "utf8",
    );

    for (const entry of addressingPlan) {
      expect(vlanCsv).toContain(`${entry.vlanId};${entry.name.replace("é", "e")}`);
      expect(vlanCsv).toContain(`;${entry.network};`);
      expect(vlanCsv).toContain(`;${entry.gateway};`);
      expect(vlanCsv).toContain(`;${entry.broadcast};`);
    }

    for (const { device } of resolvedDeviceAssignments) {
      expect(inventoryCsv).toContain(`${device.name};`);
      expect(inventoryCsv).toContain(`;${device.ip};`);
    }
  });
});
