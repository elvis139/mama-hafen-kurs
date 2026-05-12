import { Link } from "wouter";

export default function KaufAbbruch() {
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
      <div style={{ fontSize: "3rem", marginBottom: "1.2rem" }}>🌊</div>

      <h1
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
          color: "var(--foreground)",
          marginBottom: "1rem",
          lineHeight: 1.2,
        }}
      >
        Kein Problem – du kannst jederzeit zurückkehren.
      </h1>

      <p
        style={{
          fontSize: "0.97rem",
          lineHeight: 1.8,
          color: "var(--muted-foreground)",
          maxWidth: 460,
          marginBottom: "2.5rem",
        }}
      >
        Deine Zahlung wurde nicht abgeschlossen. Es wurde nichts berechnet.
        Wenn du Fragen hast, melde dich gerne.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
          width: "100%",
          maxWidth: 320,
        }}
      >
        <Link href="/#kaufen">
          <button
            style={{
              width: "100%",
              background: "var(--coral)",
              color: "white",
              border: "none",
              borderRadius: 50,
              padding: "0.9rem 1.5rem",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            ⚓ Jetzt Kurs kaufen
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
