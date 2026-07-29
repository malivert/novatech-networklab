"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("NovaTech NetworkLab a intercepté une erreur globale :", error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "grid",
          placeItems: "center",
          padding: "24px",
          color: "#edf5ff",
          background: "#07111f",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <main style={{ width: "min(620px, 100%)", textAlign: "center" }}>
          <p style={{ color: "#4ea1ff", fontWeight: 800, letterSpacing: "0.14em" }}>
            MODE DE SECOURS
          </p>
          <h1 style={{ margin: "12px 0", fontSize: "clamp(32px, 7vw, 52px)" }}>
            L’application reste récupérable
          </h1>
          <p style={{ color: "#a2b4ca", lineHeight: 1.7 }}>
            Une erreur générale a été isolée. Relancez l’application pour retrouver le dernier état
            fonctionnel.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              minHeight: "44px",
              marginTop: "24px",
              padding: "0 20px",
              border: "1px solid #4ea1ff",
              borderRadius: "9px",
              color: "#fff",
              background: "#2f81f7",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            Relancer l’application
          </button>
        </main>
      </body>
    </html>
  );
}
