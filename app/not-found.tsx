import { ArrowLeft, Network } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="recovery-shell">
      <section className="recovery-card">
        <span className="recovery-icon">
          <Network aria-hidden="true" size={30} />
        </span>
        <p className="eyebrow">ERREUR 404</p>
        <h1>Cette route n’existe pas</h1>
        <p>
          Le lien demandé ne correspond à aucune rubrique. L’application fonctionne toujours et
          vous pouvez reprendre le parcours depuis l’accueil.
        </p>
        <div className="recovery-actions">
          <Link className="primary-button" href="/">
            <ArrowLeft aria-hidden="true" size={16} />
            Retour à l’accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
