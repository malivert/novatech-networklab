import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          color: "white",
          background: "linear-gradient(145deg, #4ea1ff, #2358ca)",
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        N
      </div>
    ),
    size,
  );
}

