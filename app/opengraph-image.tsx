import { ImageResponse } from "next/og";

export const alt =
  "NovaTech NetworkLab, laboratoire interactif de diagnostic réseau de Christian Malivert";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 75% 30%, #163872 0%, #071427 42%, #050b15 100%)",
          color: "#f8fbff",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "72px 78px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#6d5dfc",
            borderRadius: 999,
            boxShadow: "0 0 80px rgba(109, 93, 252, 0.5)",
            display: "flex",
            height: 360,
            opacity: 0.22,
            position: "absolute",
            right: -120,
            top: -130,
            width: 360,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 790 }}>
          <div
            style={{
              alignItems: "center",
              color: "#7ee7ff",
              display: "flex",
              fontSize: 23,
              fontWeight: 700,
              letterSpacing: 3,
              marginBottom: 28,
            }}
          >
            NOVATECH NETWORKLAB
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1.04,
            }}
          >
            <span>Trouvez la panne.</span>
            <span style={{ color: "#8c7cff" }}>Rétablissez le réseau.</span>
          </div>
          <div
            style={{
              color: "#b7c7dc",
              display: "flex",
              fontSize: 26,
              lineHeight: 1.45,
              marginTop: 30,
            }}
          >
            8 cours · 24 questions · 6 incidents interactifs
          </div>
          <div
            style={{
              color: "#eaf3ff",
              display: "flex",
              fontSize: 22,
              fontWeight: 600,
              marginTop: 46,
            }}
          >
            Christian Malivert · BTS SIO SISR
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "rgba(10, 26, 49, 0.88)",
            border: "2px solid rgba(126, 231, 255, 0.35)",
            borderRadius: 30,
            boxShadow: "0 26px 70px rgba(0, 0, 0, 0.36)",
            display: "flex",
            flexDirection: "column",
            height: 350,
            justifyContent: "center",
            padding: 32,
            width: 250,
          }}
        >
          <div style={{ color: "#7ee7ff", display: "flex", fontSize: 70 }}>&gt;_</div>
          <div
            style={{
              color: "#8fa4bd",
              display: "flex",
              fontSize: 19,
              lineHeight: 1.5,
              marginTop: 24,
              textAlign: "center",
            }}
          >
            DNS · DHCP
            <br />
            VLAN · TCP/IP
          </div>
        </div>
      </div>
    ),
    size,
  );
}
