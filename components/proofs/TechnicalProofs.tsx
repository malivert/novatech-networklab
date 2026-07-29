import {
  CircleCheck,
  Download,
  FileText,
  Network,
  Router,
  ShieldCheck,
} from "lucide-react";
import type { CSSProperties } from "react";
import {
  addressingPlan,
  proofDocuments,
  resolvedDeviceAssignments,
} from "@/data/addressing";

function formatDhcpRange(start: string, end: string) {
  return `${start} → ${end}`;
}

export function TechnicalProofs() {
  return (
    <div className="technical-proofs">
      <section className="proof-summary">
        <article className="panel">
          <Network size={23} />
          <span>Segmentation</span>
          <strong>6 VLAN</strong>
          <p>Un sous-réseau dédié à chaque usage métier.</p>
        </article>
        <article className="panel">
          <Router size={23} />
          <span>Capacité</span>
          <strong>1 524 IP</strong>
          <p>254 adresses utilisables par réseau /24.</p>
        </article>
        <article className="panel">
          <ShieldCheck size={23} />
          <span>Isolement</span>
          <strong>Invités séparés</strong>
          <p>Le VLAN 60 ne peut atteindre que Internet.</p>
        </article>
        <article className="panel">
          <CircleCheck size={23} />
          <span>Contrôles</span>
          <strong>Automatisés</strong>
          <p>Chevauchements, plages et affectations testés en CI.</p>
        </article>
      </section>

      <section className="proof-downloads panel">
        <div className="proof-download-intro">
          <span className="eyebrow">LIVRABLES VÉRIFIABLES</span>
          <h2>Télécharger la documentation réseau</h2>
          <p>
            Ces fichiers sont versionnés avec le code. Les tests du projet vérifient que les
            données affichées et les documents téléchargés restent cohérents.
          </p>
        </div>
        <div className="proof-document-list">
          {proofDocuments.map((document) => (
            <a href={document.href} download key={document.href}>
              <span className="proof-file-icon">
                <FileText size={20} />
              </span>
              <span>
                <strong>{document.title}</strong>
                <small>{document.description}</small>
              </span>
              <span className="proof-format">{document.format}</span>
              <Download size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="addressing-section panel">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">PLAN LOGIQUE</span>
            <h2>Segmentation et plages IPv4</h2>
          </div>
          <span className="proof-badge">
            <CircleCheck size={14} /> Calculs vérifiés
          </span>
        </div>
        <div className="address-table-wrap">
          <table className="address-table">
            <caption>Plan d’adressage IPv4 des VLAN NovaTech</caption>
            <thead>
              <tr>
                <th>VLAN</th>
                <th>Usage</th>
                <th>Réseau</th>
                <th>Passerelle</th>
                <th>Plage DHCP</th>
                <th>Diffusion</th>
              </tr>
            </thead>
            <tbody>
              {addressingPlan.map((entry) => (
                <tr key={entry.vlanId}>
                  <td>
                    <span
                      className="vlan-dot"
                      style={{ "--vlan-color": entry.color } as CSSProperties}
                    />
                    {entry.vlanId}
                  </td>
                  <td>
                    <strong>{entry.name}</strong>
                    <small>{entry.policy}</small>
                  </td>
                  <td>
                    <code>{entry.network}</code>
                    <small>{entry.subnetMask}</small>
                  </td>
                  <td><code>{entry.gateway}</code></td>
                  <td>
                    {entry.dhcp ? (
                      <code>{formatDhcpRange(entry.dhcp.start, entry.dhcp.end)}</code>
                    ) : (
                      <span className="static-only">Statique uniquement</span>
                    )}
                  </td>
                  <td><code>{entry.broadcast}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="addressing-section panel">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">INVENTAIRE IP</span>
            <h2>Affectations des équipements</h2>
          </div>
          <span className="proof-badge neutral">10 équipements internes</span>
        </div>
        <div className="address-table-wrap">
          <table className="address-table device-address-table">
            <caption>Inventaire IP des équipements internes NovaTech</caption>
            <thead>
              <tr>
                <th>Équipement</th>
                <th>Rôle réseau</th>
                <th>VLAN</th>
                <th>Adresse IP</th>
                <th>Attribution</th>
              </tr>
            </thead>
            <tbody>
              {resolvedDeviceAssignments.map(({ device, vlanId, networkUse, allocation }) => (
                <tr key={device.id}>
                  <td>
                    <strong>{device.name}</strong>
                    <small>{device.type}</small>
                  </td>
                  <td>{networkUse}</td>
                  <td>{vlanId}</td>
                  <td><code>{device.ip}</code></td>
                  <td>
                    <span className={`allocation-badge ${allocation === "DHCP" ? "dhcp" : ""}`}>
                      {allocation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="proof-method panel">
        <div>
          <span className="eyebrow">MÉTHODE DE CONCEPTION</span>
          <h2>Des choix simples, expliqués et contrôlables</h2>
        </div>
        <ol>
          <li><span>01</span><div><strong>Segmenter</strong><p>Un VLAN par fonction métier réduit le domaine de diffusion et facilite les règles d’accès.</p></div></li>
          <li><span>02</span><div><strong>Réserver</strong><p>Les passerelles et équipements d’infrastructure utilisent des adresses fixes hors des plages DHCP.</p></div></li>
          <li><span>03</span><div><strong>Isoler</strong><p>Les serveurs sont en adressage statique et le Wi-Fi invité reste séparé des ressources internes.</p></div></li>
          <li><span>04</span><div><strong>Vérifier</strong><p>Vitest contrôle automatiquement les bornes de sous-réseau, les DHCP et chaque affectation IP.</p></div></li>
        </ol>
      </section>

      <p className="proof-disclaimer">
        Cette preuve documente la conception technique du laboratoire NovaTech. Le trafic de
        l’application reste simulé : aucun fichier Packet Tracer ou capture Wireshark réelle n’est
        revendiqué.
      </p>
    </div>
  );
}
