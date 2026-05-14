import { FC } from "react";

const BG = "#D32F2F";

export const OverlapMarkerView: FC = () => (
  <div
    aria-hidden
    style={{
      width: "1.125rem",
      height: "1.125rem",
      borderRadius: "50%",
      backgroundColor: BG,
      border: "0.0625rem solid rgba(255,255,255,0.9)",
      boxShadow: "0 0.0625rem 0.125rem rgba(0,0,0,0.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none"
    }}
  >
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="3" width="2" height="6" rx="1" fill="#FFFFFF" />
      <rect x="7" y="10.5" width="2" height="2" rx="1" fill="#FFFFFF" />
    </svg>
  </div>
);
