/**
 * MAMA-HAFEN BEWERTUNGSFORMULAR
 * Seite: /bewertung
 * Kursteilnehmerinnen können hier ihre Erfahrung teilen.
 * Öffentliche Felder → erscheinen nach Freigabe auf der Landingpage.
 * Privates Feld (missingText) → nur für Darleen sichtbar.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";

// Sternebewertung-Komponente
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.3rem" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "2rem",
            color: star <= (hovered || value) ? "#e07a5f" : "#d1c9b8",
            transition: "color 0.15s",
            padding: "0 0.1rem",
            lineHeight: 1,
          }}
          aria-label={`${star} Stern${star > 1 ? "e" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// Textfeld-Komponente
function Field({
  label,
  hint,
  value,
  onChange,
  multiline = false,
  required = false,
  placeholder = "",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
}) {
  const baseStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1.5px solid var(--border)",
    borderRadius: "0.75rem",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.95rem",
    color: "var(--foreground)",
    background: "white",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    resize: multiline ? "vertical" : undefined,
    minHeight: multiline ? "100px" : undefined,
  };

  return (
    <div style={{ marginBottom: "1.4rem" }}>
      <label
        style={{
          display: "block",
          fontWeight: 700,
          fontSize: "0.9rem",
          color: "var(--foreground)",
          marginBottom: "0.3rem",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--coral)", marginLeft: "0.2rem" }}>*</span>
        )}
      </label>
      {hint && (
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--muted-foreground)",
            marginBottom: "0.4rem",
            lineHeight: 1.5,
          }}
        >
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={baseStyle}
          rows={4}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={baseStyle}
        />
      )}
    </div>
  );
}

export default function Bewertung() {
  const [stars, setStars] = useState(0);
  const [email, setEmail] = useState("");
  const [childAge, setChildAge] = useState("");
  const [beforeText, setBeforeText] = useState("");
  const [afterText, setAfterText] = useState("");
  const [helpfulModule, setHelpfulModule] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [missingText, setMissingText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.review.submit.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => setError(err.message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (stars === 0) {
      setError("Bitte wähle eine Sternebewertung aus.");
      return;
    }
    if (!email.trim()) {
      setError("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }
    if (!consent) {
      setError("Bitte stimme der Veröffentlichung zu.");
      return;
    }

    submitMutation.mutate({
      email: email.trim(),
      stars,
      childAge: childAge.trim() || undefined,
      beforeText: beforeText.trim() || undefined,
      afterText: afterText.trim() || undefined,
      helpfulModule: helpfulModule.trim() || undefined,
      recommendation: recommendation.trim() || undefined,
      missingText: missingText.trim() || undefined,
      authorName: authorName.trim() || undefined,
      consentGiven: consent,
    });
  };

  // Erfolgsseite
  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100svh",
          background: "var(--cream)",
          fontFamily: "'DM Sans', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "1.5rem",
            padding: "3rem 2.5rem",
            maxWidth: "520px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 8px 40px rgba(42,124,111,0.10)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--teal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: "2rem",
            }}
          >
            ✓
          </div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.8rem",
              color: "var(--foreground)",
              marginBottom: "1rem",
            }}
          >
            Danke für dein Feedback!
          </h1>
          <p
            style={{
              color: "var(--muted-foreground)",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            Deine Bewertung wurde erfolgreich eingereicht. Ich schaue sie mir
            persönlich an und freue mich riesig über dein Vertrauen. 🌿
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              background: "var(--teal)",
              color: "white",
              padding: "0.75rem 2rem",
              borderRadius: "50px",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Zurück zur Startseite
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--cream)",
        fontFamily: "'DM Sans', sans-serif",
        padding: "2rem 1rem 4rem",
      }}
    >
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <a
            href="/"
            style={{
              display: "inline-block",
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.2rem",
              color: "var(--teal)",
              textDecoration: "none",
              marginBottom: "2rem",
            }}
          >
            ⚓ Mama-Hafen
          </a>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
              color: "var(--foreground)",
              lineHeight: 1.2,
              marginBottom: "0.8rem",
            }}
          >
            Wie war deine Erfahrung?
          </h1>
          <p
            style={{
              color: "var(--muted-foreground)",
              lineHeight: 1.7,
              fontSize: "1rem",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            Dein Feedback hilft anderen Mamas, die gerade in der gleichen
            Situation sind. Es dauert nur 2 Minuten.
          </p>
        </div>

        {/* Formular */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            borderRadius: "1.5rem",
            padding: "2.5rem",
            boxShadow: "0 4px 24px rgba(42,124,111,0.08)",
          }}
        >
          {/* Sternebewertung */}
          <div style={{ marginBottom: "1.8rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "var(--foreground)",
                marginBottom: "0.5rem",
              }}
            >
              Deine Bewertung{" "}
              <span style={{ color: "var(--coral)" }}>*</span>
            </label>
            <StarRating value={stars} onChange={setStars} />
            {stars > 0 && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--muted-foreground)",
                  marginTop: "0.2rem",
                }}
              >
                {["", "Enttäuschend", "Verbesserungswürdig", "In Ordnung", "Sehr gut", "Ausgezeichnet"][stars]}
              </p>
            )}
          </div>

          {/* Frage 1: Alter des Kindes */}
          <Field
            label="Wie alt ist dein Kind?"
            hint="z.B. 2 Jahre oder 3,5 Jahre"
            value={childAge}
            onChange={setChildAge}
            placeholder="z.B. 2 Jahre"
          />

          {/* Frage 2: Vorher */}
          <Field
            label="Wie war die Situation bei euch vor dem Kurs?"
            hint="Beschreibe kurz, was dich dazu gebracht hat, den Kurs zu kaufen."
            value={beforeText}
            onChange={setBeforeText}
            multiline
            placeholder="z.B. Täglich Wutanfälle, ich wusste nicht mehr weiter..."
          />

          {/* Frage 3: Nachher */}
          <Field
            label="Was hat sich seitdem verändert?"
            hint="Was ist jetzt anders – bei dir, bei eurem Kind, im Alltag?"
            value={afterText}
            onChange={setAfterText}
            multiline
            placeholder="z.B. Ich reagiere viel ruhiger und verstehe jetzt, warum mein Kind so reagiert..."
          />

          {/* Frage 4: Hilfreichstes Modul */}
          <Field
            label="Welches Modul oder welcher Tipp hat dir am meisten geholfen?"
            hint="Gerne konkret – das hilft anderen Mamas beim Entscheiden."
            value={helpfulModule}
            onChange={setHelpfulModule}
            multiline
            placeholder="z.B. Modul 6 über Erste Hilfe bei Wutanfällen hat mir wirklich geholfen..."
          />

          {/* Frage 5: Weiterempfehlung */}
          <Field
            label="Würdest du den Kurs weiterempfehlen – und warum?"
            value={recommendation}
            onChange={setRecommendation}
            multiline
            placeholder="z.B. Ja, auf jeden Fall! Jede Mama in der Trotzphase sollte diesen Kurs machen..."
          />

          {/* Trennlinie */}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              margin: "1.5rem 0",
              paddingTop: "1.5rem",
            }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--muted-foreground)",
                marginBottom: "1.2rem",
                fontStyle: "italic",
              }}
            >
              Die folgende Frage ist nur für Darleen sichtbar – sie erscheint
              nicht auf der Website.
            </p>
          </div>

          {/* Frage 6: Was hat gefehlt (privat) */}
          <Field
            label="Was hat dir gefehlt oder was würdest du dir noch wünschen?"
            hint="Dein ehrliches Feedback hilft mir, den Kurs zu verbessern."
            value={missingText}
            onChange={setMissingText}
            multiline
            placeholder="z.B. Ein Modul über Geschwisterstreit wäre toll gewesen..."
          />

          {/* Trennlinie */}
          <div style={{ borderTop: "1px solid var(--border)", margin: "1.5rem 0", paddingTop: "1.5rem" }} />

          {/* Name */}
          <Field
            label="Dein Name (für die Website)"
            hint="Vorname + Anfangsbuchstabe Nachname, z.B. Sarah M."
            value={authorName}
            onChange={setAuthorName}
            placeholder="z.B. Sarah M."
          />

          {/* E-Mail */}
          <Field
            label="Deine E-Mail-Adresse"
            hint="Wird nicht veröffentlicht – nur zur Verifizierung."
            value={email}
            onChange={setEmail}
            required
            placeholder="deine@email.de"
          />

          {/* Einwilligung */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{
                  width: 18,
                  height: 18,
                  marginTop: "0.15rem",
                  flexShrink: 0,
                  accentColor: "var(--teal)",
                }}
              />
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--muted-foreground)",
                  lineHeight: 1.6,
                }}
              >
                Ich bin damit einverstanden, dass meine Bewertung (ohne E-Mail)
                auf der Mama-Hafen-Website veröffentlicht werden darf.{" "}
                <span style={{ color: "var(--coral)" }}>*</span>
              </span>
            </label>
          </div>

          {/* Fehler */}
          {error && (
            <div
              style={{
                background: "#fff5f5",
                border: "1px solid #fed7d7",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                color: "#c53030",
                fontSize: "0.875rem",
                marginBottom: "1.2rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitMutation.isPending}
            style={{
              width: "100%",
              background: submitMutation.isPending ? "var(--sand)" : "var(--coral)",
              color: "white",
              border: "none",
              borderRadius: "50px",
              padding: "1rem",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: submitMutation.isPending ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {submitMutation.isPending ? "Wird gesendet..." : "Bewertung absenden ✓"}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.78rem",
              color: "var(--muted-foreground)",
              marginTop: "1rem",
            }}
          >
            Deine Bewertung wird vor der Veröffentlichung geprüft.
          </p>
        </form>
      </div>
    </div>
  );
}
