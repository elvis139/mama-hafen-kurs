import { useState, useEffect } from "react";

const COOKIE_KEY = "mama_hafen_cookie_consent";

export type ConsentStatus = "accepted" | "declined" | null;

export function getConsentStatus(): ConsentStatus {
  try {
    return (localStorage.getItem(COOKIE_KEY) as ConsentStatus) ?? null;
  } catch {
    return null;
  }
}

export function loadTrackingScripts() {
  // Meta Pixel 1
  if (!(window as any).fbq) {
    const script1 = document.createElement("script");
    script1.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '4541103249457123');
      fbq('init', '1464149581564441');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script1);
  }

  // Google Analytics
  if (!(window as any).gtag) {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-CF7P1QL6EZ";
    document.head.appendChild(gaScript);

    const gaInit = document.createElement("script");
    gaInit.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-CF7P1QL6EZ');
    `;
    document.head.appendChild(gaInit);
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const status = getConsentStatus();
    if (status === "accepted") {
      loadTrackingScripts();
      setVisible(false);
    } else if (status === "declined") {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    loadTrackingScripts();
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "white",
        borderTop: "1px solid #e5e7eb",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.10)",
        padding: "1.1rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.88rem",
            lineHeight: 1.6,
            color: "#374151",
          }}
        >
          🍪 Wir verwenden Cookies und ähnliche Technologien (Meta Pixel, Google
          Analytics), um unsere Website zu verbessern und dir relevante Inhalte
          zu zeigen. Mit einem Klick auf „Akzeptieren" stimmst du dem zu. Mehr
          dazu in unserer{" "}
          <a
            href="/datenschutz"
            style={{ color: "#0d7a6e", textDecoration: "underline" }}
          >
            Datenschutzerklärung
          </a>
          .
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.7rem",
            flexWrap: "wrap",
            marginTop: "0.5rem",
          }}
        >
          <button
            onClick={accept}
            style={{
              background: "#0d7a6e",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "0.55rem 1.4rem",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Akzeptieren
          </button>
          <button
            onClick={decline}
            style={{
              background: "transparent",
              color: "#6b7280",
              border: "1.5px solid #d1d5db",
              borderRadius: 8,
              padding: "0.55rem 1.2rem",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Ablehnen
          </button>
        </div>
      </div>
    </div>
  );
}
