"use client";

import { CircleAlert, House, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("NovaTech NetworkLab a intercepté une erreur :", error);
  }, [error]);

  return (
    <main className="recovery-shell">
      <section className="recovery-card" role="alert">
        <span className="recovery-icon">
          <CircleAlert aria-hidden="true" size={30} />
        </span>
        <p className="eyebrow">PROTECTION ACTIVE</p>
        <h1>Cette partie n’a pas pu s’afficher</h1>
        <p>
          Le reste de l’application reste protégé. Vous pouvez relancer cette page ou revenir à
          l’accueil sans perdre la progression déjà enregistrée.
        </p>
        <div className="recovery-actions">
          <button className="primary-button" type="button" onClick={() => unstable_retry()}>
            <RotateCcw aria-hidden="true" size={16} />
            Réessayer
          </button>
          <Link className="secondary-button" href="/">
            <House aria-hidden="true" size={16} />
            Revenir à l’accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
