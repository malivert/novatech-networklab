import { networkDevices, vlans } from "@/data/network";

export interface DhcpRange {
  start: string;
  end: string;
}

export interface AddressingPlanEntry {
  vlanId: number;
  name: string;
  network: string;
  prefixLength: 24;
  subnetMask: "255.255.255.0";
  gateway: string;
  firstUsable: string;
  lastUsable: string;
  broadcast: string;
  dhcp: DhcpRange | null;
  policy: string;
  color: string;
}

interface AddressingDetails {
  gateway: string;
  dhcp: DhcpRange | null;
  policy: string;
}

const addressingDetails: Record<number, AddressingDetails> = {
  10: {
    gateway: "10.10.0.1",
    dhcp: { start: "10.10.0.20", end: "10.10.0.199" },
    policy: "Accès aux services internes, journalisation renforcée.",
  },
  20: {
    gateway: "10.20.0.1",
    dhcp: { start: "10.20.0.20", end: "10.20.0.199" },
    policy: "Accès ERP et fichiers, flux inter-VLAN limités.",
  },
  30: {
    gateway: "10.30.0.1",
    dhcp: { start: "10.30.0.20", end: "10.30.0.199" },
    policy: "Accès CRM, DNS, DHCP et Internet.",
  },
  40: {
    gateway: "10.40.0.1",
    dhcp: { start: "10.40.0.50", end: "10.40.0.199" },
    policy: "Administration des équipements et supervision.",
  },
  50: {
    gateway: "10.50.0.1",
    dhcp: null,
    policy: "Adressage statique, accès entrant filtré par service.",
  },
  60: {
    gateway: "10.60.0.1",
    dhcp: { start: "10.60.0.50", end: "10.60.0.230" },
    policy: "Internet uniquement, isolation complète du réseau interne.",
  },
};

export const addressingPlan: AddressingPlanEntry[] = vlans.map((vlan) => {
  const details = addressingDetails[vlan.id];
  const octets = vlan.subnet.split(".").slice(0, 3).join(".");

  return {
    vlanId: vlan.id,
    name: vlan.name,
    network: vlan.subnet,
    prefixLength: 24,
    subnetMask: "255.255.255.0",
    gateway: details.gateway,
    firstUsable: `${octets}.1`,
    lastUsable: `${octets}.254`,
    broadcast: `${octets}.255`,
    dhcp: details.dhcp,
    policy: details.policy,
    color: vlan.color,
  };
});

export type AddressAllocation = "Statique" | "DHCP";

export interface DeviceAddressingAssignment {
  deviceId: string;
  vlanId: number;
  networkUse: string;
  allocation: AddressAllocation;
}

export const deviceAddressingAssignments: DeviceAddressingAssignment[] = [
  {
    deviceId: "fw-01",
    vlanId: 50,
    networkUse: "Passerelle et filtrage du réseau serveurs",
    allocation: "Statique",
  },
  {
    deviceId: "rtr-01",
    vlanId: 40,
    networkUse: "Routage inter-VLAN et gestion",
    allocation: "Statique",
  },
  {
    deviceId: "sw-core",
    vlanId: 40,
    networkUse: "Administration du commutateur principal",
    allocation: "Statique",
  },
  {
    deviceId: "ap-01",
    vlanId: 40,
    networkUse: "Gestion de la borne, clients transportés sur le VLAN 60",
    allocation: "Statique",
  },
  {
    deviceId: "srv-infra",
    vlanId: 50,
    networkUse: "DNS, DHCP et NTP",
    allocation: "Statique",
  },
  {
    deviceId: "srv-files",
    vlanId: 50,
    networkUse: "SMB et sauvegardes",
    allocation: "Statique",
  },
  {
    deviceId: "pc-dir",
    vlanId: 10,
    networkUse: "Poste Direction",
    allocation: "DHCP",
  },
  {
    deviceId: "pc-cpta",
    vlanId: 20,
    networkUse: "Poste Comptabilité",
    allocation: "DHCP",
  },
  {
    deviceId: "pc-com",
    vlanId: 30,
    networkUse: "Poste Commercial",
    allocation: "DHCP",
  },
  {
    deviceId: "pc-it",
    vlanId: 40,
    networkUse: "Poste d’administration",
    allocation: "Statique",
  },
];

export const resolvedDeviceAssignments = deviceAddressingAssignments.map((assignment) => {
  const device = networkDevices.find((item) => item.id === assignment.deviceId);

  if (!device) {
    throw new Error(`Équipement absent du plan d’adressage : ${assignment.deviceId}`);
  }

  return { ...assignment, device };
});

export const proofDocuments = [
  {
    href: "/preuves/plan-vlans-novatech.csv",
    title: "Plan des VLAN",
    format: "CSV",
    description: "Réseaux, masques, passerelles, DHCP, diffusion et politiques d’accès.",
  },
  {
    href: "/preuves/inventaire-ip-novatech.csv",
    title: "Inventaire des adresses IP",
    format: "CSV",
    description: "Affectations statiques et dynamiques des équipements de la topologie.",
  },
  {
    href: "/preuves/dossier-technique-adressage.md",
    title: "Dossier technique",
    format: "MD",
    description: "Hypothèses, règles de conception, contrôles et limites du laboratoire.",
  },
] as const;
