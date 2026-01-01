"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseProps {
  pId: string;
  slot: string;
  style?: React.CSSProperties;
  format?: string;
  responsive?: string;
}

const AdSense = ({
  pId,
  slot,
  style = { display: "block" },
  format = "auto",
  responsive = "true",
}: AdSenseProps) => {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  if (process.env.NODE_ENV === "development") {
    return (
      <div
        style={{
          ...style,
          background: "#e0e0e0",
          color: "#666",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #999",
          height: style?.height || "280px", // 기본 높이 설정
          width: "100%",
        }}
      >
        광고 영역 (Localhost)
        <br />
        Slot: {slot}
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={`ca-pub-${pId}`}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};

export default AdSense;
