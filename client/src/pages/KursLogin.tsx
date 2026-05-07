/**
 * Mama-Hafen Kurs-Login – Magic-Link-Seite
 * Design: Coastal Calm – DM Serif Display + DM Sans, Teal + Sand + Coral
 *
 * Test-Modus: Das Magic-Token wird direkt angezeigt, damit man ohne E-Mail testen kann.
 * Später: Token per E-Mail versenden und nur Bestätigungsmeldung zeigen.
 */

import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function KursLogin() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"input" | "sent" | "verifying" | "error">("input");
  const [testToken, setTestToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [, navigate] = useLocation();

  // Beim Laden: prüfen ob bereits ein Session-Token im localStorage vorhanden ist
  useEffect(() => {
    const sessionToken = localStorage.getItem("mama_hafen_session");
    if (sessionToken) {
      navigate("/kurs");
    }
  }, [navigate]);

  const requestAccess = trpc.course.requestAccess.useMutation({
    onSuccess: (data) => {
      setTestToken(data.testModeToken ?? null);
      setStep("sent");
    },
    onError: (err) => {
      setErrorMsg(err.message);
      setStep("error");
    },
  });

  const verifyToken = trpc.course.verifyToken.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("mama_hafen_session", data.sessionToken);
      navigate("/kurs");
    },
    onError: (err) => {
      setErrorMsg(err.message);
      setStep("error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    requestAccess.mutate({ email: email.trim() });
  };

  const handleTestLogin = () => {
    if (!testToken) return;
    setStep("verifying");
    verifyToken.mutate({ token: testToken });
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--cream)",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      {/* Logo / Header */}
      <a
        href="/"
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.3rem",
          fontWeight: 700,
          color: "var(--teal)",
          textDecoration: "none",
          marginBottom: "2.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        ⚓ Mama-Hafen
      </a>

      {/* Karte */}
      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: "2.5rem 2rem",
          boxShadow: "0 8px 40px rgba(0,0,0,0.09)",
          border: "1px solid var(--border)",
          width: "100%",
          maxWidth: 440,
        }}
      >
        {step === "input" && (
          <>
            <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🔑</div>
              <h1
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.6rem",
                  color: "var(--foreground)",
                  marginBottom: "0.5rem",
                }}
              >
                Zum Kurs anmelden
              </h1>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Gib deine E-Mail-Adresse ein – du erhältst sofort Zugang zum Kurs.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    marginBottom: "0.4rem",
                    color: "var(--foreground)",
                  }}
                >
                  E-Mail-Adresse
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="deine@email.de"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    border: "1.5px solid var(--border)",
                    borderRadius: 12,
                    fontSize: "0.97rem",
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                    background: "var(--cream)",
                    color: "var(--foreground)",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--teal)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <button
                type="submit"
                disabled={requestAccess.isPending}
                style={{
                  width: "100%",
                  background: requestAccess.isPending ? "var(--muted)" : "var(--teal)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "0.95rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: requestAccess.isPending ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {requestAccess.isPending ? "Wird verarbeitet…" : "🚀 Zugang anfordern"}
              </button>
            </form>

            <p
              style={{
                textAlign: "center",
                color: "var(--muted-foreground)",
                fontSize: "0.78rem",
                marginTop: "1.2rem",
                lineHeight: 1.5,
              }}
            >
              Kein Passwort nötig · Kein Spam · Jederzeit kündbar
            </p>
          </>
        )}

        {step === "sent" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>✅</div>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.4rem",
                marginBottom: "0.6rem",
                color: "var(--foreground)",
              }}
            >
              Zugang bereit!
            </h2>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Im Test-Modus wird der Zugang direkt gewährt. Klicke unten, um den Kurs zu starten.
            </p>

            {/* Test-Modus: Direkter Login-Button */}
            {testToken && (
              <div
                style={{
                  background: "var(--sand)",
                  borderRadius: 12,
                  padding: "1rem",
                  marginBottom: "1.2rem",
                  border: "1px dashed var(--teal)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "var(--teal)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.5rem",
                  }}
                >
                  🧪 Test-Modus aktiv
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", marginBottom: "0.8rem", lineHeight: 1.5 }}>
                  Später wird ein Link an <strong>{email}</strong> gesendet.
                  Im Test-Modus kannst du direkt einloggen:
                </p>
                <button
                  onClick={handleTestLogin}
                  disabled={verifyToken.isPending}
                  style={{
                    width: "100%",
                    background: "var(--coral)",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    padding: "0.8rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    cursor: verifyToken.isPending ? "not-allowed" : "pointer",
                  }}
                >
                  {verifyToken.isPending ? "Wird eingeloggt…" : "🎬 Jetzt Kurs starten"}
                </button>
              </div>
            )}

            <button
              onClick={() => { setStep("input"); setTestToken(null); }}
              style={{
                background: "none",
                border: "none",
                color: "var(--teal)",
                fontSize: "0.85rem",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Andere E-Mail verwenden
            </button>
          </div>
        )}

        {step === "verifying" && (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
            <p style={{ color: "var(--muted-foreground)" }}>Wird angemeldet…</p>
          </div>
        )}

        {step === "error" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>❌</div>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.3rem",
                marginBottom: "0.6rem",
                color: "var(--foreground)",
              }}
            >
              Etwas ist schiefgelaufen
            </h2>
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              {errorMsg}
            </p>
            <button
              onClick={() => { setStep("input"); setErrorMsg(""); }}
              style={{
                background: "var(--teal)",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "0.8rem 1.5rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              Erneut versuchen
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <p
        style={{
          marginTop: "2rem",
          color: "var(--muted-foreground)",
          fontSize: "0.78rem",
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} Mama-Hafen · Ein Kurs von Darleen ·{" "}
        <a href="https://www.darvismedia.de" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>
          darvismedia.de
        </a>
      </p>
    </div>
  );
}
