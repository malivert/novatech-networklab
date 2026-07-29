import type { Scenario } from "@/types/network";

export interface TerminalContext {
  scenario: Scenario;
  corrected: boolean;
}

export interface TerminalResult {
  output: string;
  useful: boolean;
}

const HELP = `Commandes disponibles :
  help, clear, ipconfig, ipconfig /all, ipconfig /release, ipconfig /renew
  ping [hôte], nslookup [nom], tracert [hôte], arp -a, route print
  netstat -an, Test-NetConnection [hôte] -Port [port]`;

const okPing = (target: string) =>
  `Envoi d’une requête 'Ping' sur ${target} avec 32 octets de données :
Réponse de ${target} : octets=32 temps=2 ms TTL=126
Réponse de ${target} : octets=32 temps=2 ms TTL=126

Paquets : envoyés = 2, reçus = 2, perdus = 0 (perte 0%).`;

const failedPing = (target: string) =>
  `Envoi d’une requête 'Ping' sur ${target} :
Délai d’attente de la demande dépassé.
Délai d’attente de la demande dépassé.

Paquets : envoyés = 2, reçus = 0, perdus = 2 (perte 100%).`;

function configuration(scenario: Scenario, corrected: boolean, all: boolean) {
  let ip = "10.40.0.18";
  let gateway = "10.40.0.1";
  let dns = "10.50.0.10";
  let suffix = "novatech.local";

  if (scenario.id === "dns-incorrect") {
    ip = "10.10.0.34";
    gateway = "10.10.0.1";
    dns = corrected ? "10.50.0.10" : "10.50.0.99";
  }
  if (scenario.id === "gateway-error") {
    ip = "10.10.0.34";
    gateway = corrected ? "10.10.0.1" : "10.10.0.254";
  }
  if (scenario.id === "wrong-vlan") {
    ip = corrected ? "10.20.0.47" : "10.30.0.83";
    gateway = corrected ? "10.20.0.1" : "10.30.0.1";
  }
  if (scenario.id === "dhcp-exhausted") {
    ip = corrected ? "10.60.0.104" : "169.254.77.14";
    gateway = corrected ? "10.60.0.1" : "";
    dns = corrected ? "10.50.0.10" : "";
    suffix = "";
  }
  if (scenario.id === "firewall-block") {
    ip = "10.20.0.47";
    gateway = "10.20.0.1";
  }
  if (scenario.id === "ip-conflict") {
    ip = "10.30.0.62";
    gateway = "10.30.0.1";
  }

  return `Configuration IP de Windows

Carte Ethernet Ethernet :
   ${all ? `Suffixe DNS propre à la connexion. . . : ${suffix || "(aucun)"}\n   Description. . . . . . . . . . . . . : Intel(R) Ethernet I219-LM\n   DHCP activé. . . . . . . . . . . . . : Oui\n   ` : ""}Adresse IPv4. . . . . . . . . . . . . : ${ip}
   Masque de sous-réseau. . . . . . . . : 255.255.255.0
   Passerelle par défaut. . . . . . . . : ${gateway || "(aucune)"}
   ${all ? `Serveurs DNS. . . . . . . . . . . . : ${dns || "(aucun)"}` : ""}`.trim();
}

export function normalizeCommand(command: string): string {
  return command.trim().toLowerCase().replace(/\s+/g, " ");
}

export function executeCommand(command: string, context: TerminalContext): TerminalResult {
  const normalized = normalizeCommand(command);
  const { scenario, corrected } = context;
  const useful = scenario.expectedCommands.some((expected) => {
    const expectedNormalized = normalizeCommand(expected);
    return normalized === expectedNormalized || normalized.startsWith(expectedNormalized);
  });

  if (!normalized) return { output: "", useful: false };
  if (normalized === "help") return { output: HELP, useful: true };
  if (normalized === "clear") return { output: "", useful: false };
  if (normalized === "ipconfig") return { output: configuration(scenario, corrected, false), useful };
  if (normalized === "ipconfig /all") return { output: configuration(scenario, corrected, true), useful };
  if (normalized === "ipconfig /release") {
    return { output: "Configuration IP libérée. L’interface Ethernet ne possède plus de bail actif.", useful };
  }
  if (normalized === "ipconfig /renew") {
    const failed = scenario.id === "dhcp-exhausted" && !corrected;
    return {
      output: failed
        ? "Une erreur s’est produite : impossible de contacter votre serveur DHCP. Le délai d’attente a expiré."
        : `Configuration IP renouvelée avec succès.\n${configuration(scenario, corrected, false)}`,
      useful,
    };
  }

  if (normalized.startsWith("ping ")) {
    const target = command.trim().slice(5);
    const externalIp = target === "8.8.8.8";
    const localGateway = /^10\.(10|20|30|40|60)\.0\.1$/.test(target);
    const shouldFail =
      (!corrected && scenario.id === "gateway-error" && !target.startsWith("10.10.0.")) ||
      (!corrected && scenario.id === "dhcp-exhausted") ||
      (!corrected && scenario.id === "wrong-vlan" && target.startsWith("10.20.0.")) ||
      (!corrected && scenario.id === "ip-conflict") ||
      (!corrected && scenario.id === "dns-incorrect" && !externalIp && !/^\d+\.\d+\.\d+\.\d+$/.test(target));
    return { output: shouldFail && !localGateway ? failedPing(target) : okPing(target), useful };
  }

  if (normalized.startsWith("nslookup")) {
    const target = command.trim().split(/\s+/)[1] ?? "intranet.novatech.local";
    const failed = scenario.id === "dns-incorrect" && !corrected;
    return {
      output: failed
        ? `Serveur :  UnKnown\nAddress:  10.50.0.99\n\n*** Le délai de la requête DNS a expiré pour ${target}.`
        : `Serveur :  SRV-INFRA-01.novatech.local\nAddress:  10.50.0.10\n\nNom :    ${target}\nAddress:  10.50.0.20`,
      useful,
    };
  }

  if (normalized.startsWith("tracert ")) {
    const target = command.trim().slice(7);
    if (scenario.id === "gateway-error" && !corrected) {
      return { output: `Détermination de l’itinéraire vers ${target}\n  1     *     *     *     Délai d’attente dépassé.\nItinéraire interrompu.`, useful };
    }
    return {
      output: `Détermination de l’itinéraire vers ${target}\n  1     1 ms     1 ms     1 ms  ${scenario.id === "wrong-vlan" && !corrected ? "10.30.0.1" : "10.20.0.1"}\n  2     2 ms     2 ms     2 ms  ${target}\nItinéraire déterminé.`,
      useful,
    };
  }

  if (normalized === "arp -a") {
    return {
      output:
        scenario.id === "ip-conflict" && !corrected
          ? `Interface : 10.30.0.62\n  Adresse Internet      Adresse physique      Type\n  10.30.0.1            00-18-73-4a-90-01     dynamique\n  10.30.0.62           7c-d3-0a-61-44-b2     dynamique\n  ! Alerte : l’hôte 10.30.0.62 est également annoncé par 90-e2-ba-17-09-cc`
          : `Interface active\n  Adresse Internet      Adresse physique      Type\n  10.30.0.1            00-18-73-4a-90-01     dynamique\n  10.50.0.10           00-18-73-4a-50-10     dynamique`,
      useful,
    };
  }

  if (normalized === "route print") {
    const badGateway = scenario.id === "gateway-error" && !corrected;
    return {
      output: `Table de routage IPv4
Destination réseau    Masque réseau      Adr. passerelle
0.0.0.0               0.0.0.0            ${badGateway ? "10.10.0.254" : "10.10.0.1"}
10.10.0.0             255.255.255.0      On-link
127.0.0.0             255.0.0.0          On-link`,
      useful,
    };
  }

  if (normalized === "netstat -an") {
    return {
      output: `Connexions actives
  Proto  Adresse locale         Adresse distante       État
  TCP    10.20.0.47:51532       10.50.0.20:445         ${scenario.id === "firewall-block" && !corrected ? "SYN_SENT" : "ESTABLISHED"}
  UDP    10.20.0.47:5353        *:*`,
      useful,
    };
  }

  if (normalized.startsWith("test-netconnection ")) {
    const match = normalized.match(/test-netconnection\s+(\S+)\s+-port\s+(\d+)/);
    if (!match) {
      return { output: "Syntaxe : Test-NetConnection [hôte] -Port [port]", useful: false };
    }
    const [, host, port] = match;
    const blocked = scenario.id === "firewall-block" && !corrected && port === "445";
    return {
      output: `ComputerName     : ${host}
RemoteAddress    : ${host}
RemotePort       : ${port}
InterfaceAlias   : Ethernet
TcpTestSucceeded : ${blocked ? "False" : "True"}`,
      useful,
    };
  }

  return {
    output: `'${command}' n’est pas reconnu. Saisissez help pour afficher les commandes disponibles.`,
    useful: false,
  };
}

