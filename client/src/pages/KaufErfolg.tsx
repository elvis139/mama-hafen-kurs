import { useEffect } from "react";
import { Link } from "wouter";

export default function KaufErfolg() {
  useEffect(() => {
    window.scrollTo(0, 0);
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
      }}
    >
      {/* Anker-Icon */}
      <div style={{ fontSize: "3.5rem", marginBottom: "1.2rem" }}>⚓</div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
          color: "var(--teal-dark)",
          marginBottom: "1rem",
          lineHeight: 1.2,
        }}
      >
        Herzlich willkommen im Mama-Hafen!
      </h1>

      {/* Bestätigungstext */}
      <p
        style={{
          fontSize: "1rem",
          lineHeight: 1.8,
          color: "var(--muted-foreground)",
          maxWidth: 480,
          marginBottom: "2.5rem",
        }}
      >
        Deine Zahlung war erfolgreich – dein Kurszugang ist jetzt aktiv.
        Klicke auf den Button unten, gib deine E-Mail-Adresse ein und starte
        sofort.
      </p>

      {/* CTA-Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
          width: "100%",
          maxWidth: 340,
        }}
      >
        <Link href="/kurs/login">
          <button
            style={{
              width: "100%",
              background: "var(--teal)",
              color: "white",
              border: "none",
              borderRadius: 50,
              padding: "0.9rem 1.5rem",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
              letterSpacing: "0.02em",
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
              border: "2px solid var(--teal)",
              borderRadius: 50,
              padding: "0.9rem 1.5rem",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            Zurück zur Startseite
          </button>
        </Link>
      </div>

      {/* Footer */}
      <p
        style={{
          marginTop: "3rem",
          fontSize: "0.78rem",
          color: "var(--muted-foreground)",
          opacity: 0.7,
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
