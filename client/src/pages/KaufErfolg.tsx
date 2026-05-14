import { useEffect, useState } from "react";
import { Link } from "wouter";

// Google gtag + Meta Pixel Typen
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

export default function KaufErfolg() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Kurze Verzögerung für Einblend-Animation
    const t = setTimeout(() => setVisible(true), 80);

    // Google Analytics: Kauf-Conversion feuern
    // Nur wenn eine echte Stripe session_id in der URL steht
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const dedupeKey = sessionId ? `ga_purchase_fired_${sessionId}` : null;

    if (
      sessionId &&
      dedupeKey &&
      !sessionStorage.getItem(dedupeKey) &&
      typeof window.gtag === "function"
    ) {
      window.gtag("event", "purchase", {
        transaction_id: sessionId,
        value: 99,
        currency: "EUR",
        items: [
          {
            item_id: "mama-hafen-kurs",
            item_name: "Mama-Hafen Online-Kurs",
            price: 99,
            quantity: 1,
          },
        ],
      });
      // Dedupe: pro Session nur einmal senden
      sessionStorage.setItem(dedupeKey, "1");

      // Meta Pixel: Purchase-Event
      if (typeof window.fbq === "function") {
        window.fbq("track", "Purchase", {
          value: 99,
          currency: "EUR",
          content_ids: ["mama-hafen-kurs"],
          content_type: "product",
        });
      }
    }

    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cream)",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dekorative Hintergrundkreise */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "var(--teal)",
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-80px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "var(--coral)",
          opacity: 0.07,
          pointerEvents: "none",
        }}
      />

      {/* Karte */}
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 8px 40px rgba(42,157,143,0.12), 0 2px 12px rgba(0,0,0,0.06)",
          padding: "clamp(2rem, 6vw, 3.5rem) clamp(1.5rem, 5vw, 3rem)",
          maxWidth: "520px",
          width: "100%",
          position: "relative",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.55s ease, transform 0.55s ease",
        }}
      >
        {/* Erfolgs-Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            background: "linear-gradient(135deg, #d4f5f0 0%, #e8f9f6 100%)",
            color: "var(--teal)",
            borderRadius: "50px",
            padding: "0.4rem 1rem",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "1.6rem",
            border: "1px solid rgba(42,157,143,0.2)",
          }}
        >
          <span style={{ fontSize: "0.9rem" }}>✓</span> Zahlung erfolgreich
        </div>

        {/* Großes Check-Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--teal) 0%, #1a7a6e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.6rem",
            boxShadow: "0 6px 24px rgba(42,157,143,0.35)",
          }}
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 19.5L15.5 27L30 12"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.7rem, 5vw, 2.3rem)",
            color: "var(--teal-dark, #1a6b61)",
            marginBottom: "0.8rem",
            lineHeight: 1.2,
          }}
        >
          Herzlich willkommen im Mama-Hafen! ⚓
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "var(--muted-foreground)",
            marginBottom: "2rem",
            maxWidth: "400px",
            margin: "0 auto 2rem",
          }}
        >
          Deine Zahlung wurde bestätigt und dein Kurszugang ist{" "}
          <strong style={{ color: "var(--teal)" }}>sofort aktiv</strong>. Gib
          unten einfach deine E-Mail-Adresse ein und starte direkt durch.
        </p>

        {/* Was du bekommst */}
        <div
          style={{
            background: "linear-gradient(135deg, #f5fffe 0%, #f0faf8 100%)",
            border: "1px solid rgba(42,157,143,0.18)",
            borderRadius: "14px",
            padding: "1.2rem 1.4rem",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--teal)",
              marginBottom: "0.8rem",
            }}
          >
            Dein Zugang beinhaltet
          </p>
          {[
            "11 Video-Module – sofort & dauerhaft verfügbar",
            "Workbook als PDF zum Mitmachen",
            "Gelassen durch die Autonomiephase",
            "Lebenslanger Zugang – auch fürs nächste Kind",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.6rem",
                marginBottom: "0.55rem",
                fontSize: "0.9rem",
                color: "var(--foreground)",
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "var(--teal)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  marginTop: "1px",
                }}
              >
                ✓
              </span>
              {item}
            </div>
          ))}
        </div>

        {/* CTA-Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <Link href="/kurs/login">
            <button
              style={{
                width: "100%",
                background: "linear-gradient(135deg, var(--teal) 0%, #1a7a6e 100%)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                padding: "1rem 1.5rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 800,
                fontSize: "1.05rem",
                cursor: "pointer",
                letterSpacing: "0.02em",
                boxShadow: "0 4px 18px rgba(42,157,143,0.35)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(42,157,143,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 18px rgba(42,157,143,0.35)";
              }}
            >
              🎬 Jetzt Kurs starten
            </button>
          </Link>

          <Link href="/">
            <button
              style={{
                width: "100%",
                background: "transparent",
                color: "var(--teal)",
                border: "2px solid rgba(42,157,143,0.35)",
                borderRadius: "50px",
                padding: "0.85rem 1.5rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.92rem",
                cursor: "pointer",
                transition: "border-color 0.15s ease",
              }}
            >
              Zurück zur Startseite
            </button>
          </Link>
        </div>

        {/* Fragen-Hinweis */}
        <p
          style={{
            marginTop: "1.6rem",
            fontSize: "0.78rem",
            color: "var(--muted-foreground)",
            opacity: 0.75,
            lineHeight: 1.6,
          }}
        >
          Fragen? Schreib uns jederzeit.
        </p>
      </div>

      {/* Footer */}
      <p
        style={{
          marginTop: "2rem",
          fontSize: "0.75rem",
          color: "var(--muted-foreground)",
          opacity: 0.55,
        }}
      >
        © Darleen – Mama-Hafen &nbsp;·&nbsp;{" "}
        <a
          href="https://www.darvismedia.de"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--teal)" }}
        >
          darvismedia.de
        </a>
      </p>
    </div>
  );
}
