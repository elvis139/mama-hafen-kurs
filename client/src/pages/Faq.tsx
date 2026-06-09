/**
 * /faq – Häufige Fragen als eigene Seite
 * Eigenständige Unterseite für Google Sitelinks
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="fade-up" style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid var(--border)", padding: "1.2rem 0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", textAlign: "left", background: "none", border: "none",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          gap: "0.8rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", padding: 0, lineHeight: 1.5,
        }}
      >
        <span style={{ flex: 1 }}>{q}</span>
        <span style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
          background: open ? "var(--teal)" : "var(--sand)", color: open ? "white" : "var(--teal)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.2rem", fontWeight: 700, transition: "all 0.2s", marginTop: "0.1rem",
        }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p style={{ marginTop: "0.8rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontSize: "0.95rem" }}>
          {a}
        </p>
      )}
    </div>
  );
}

const faqs = [
  {
    q: "Für welches Alter ist der Kurs geeignet?",
    a: "Der Kurs ist exakt für Mamas von Kindern zwischen 1,5 und 6 Jahren konzipiert. Genau für die Zeit, die viele von uns als die anstrengendste Phase überhaupt erleben.",
    defaultOpen: true,
  },
  {
    q: "Muss ich viel Zeit investieren? Mir fehlt oft die Kraft.",
    a: "Nein – und das war mir extrem wichtig. Ich habe die Videos bewusst kurz gehalten: 5 bis 15 Minuten pro Lektion. Du kannst den Kurs in winzigen Häppchen absolvieren. Keine stundenlangen Monologe, sondern schnelle, umsetzbare Praxis-Tipps.",
  },
  {
    q: "Wie lange habe ich Zugang?",
    a: "Du kaufst den Kurs einmal und behältst ihn für immer. Auch dann noch, wenn dein zweites Kind in die Trotzphase kommt.",
  },
  {
    q: "Ist der Ansatz zu 'weich'? Ich möchte meinem Kind trotzdem Grenzen setzen.",
    a: "Das fragen mich viele – und ich verstehe die Sorge absolut. Aber bindungsorientiert bedeutet nicht grenzenlos! Ganz im Gegenteil: Du lernst hier, wie du klare und liebevolle Grenzen setzt. Nur eben ohne Schreien, ohne Strafen und ohne Machtkampf.",
  },
  {
    q: "Funktioniert das wirklich bei meinem Kind? Jedes Kind ist doch anders.",
    a: "Ich kann dir keine Garantie geben, dass sich euer Leben von heute auf morgen komplett dreht – das wäre unehrlich. Aber: Die Grundprinzipien der Autonomiephase und der Gehirnentwicklung gelten für alle Kinder in diesem Alter. Wenn du verstehst, was wirklich in deinem Kind vorgeht, verändert sich deine Reaktion. Und wenn du dich veränderst, verändert sich dein Kind.",
  },
  {
    q: "Wann erhalte ich Zugang nach dem Kauf?",
    a: "Sofort! Nach erfolgreicher Zahlung erhältst du direkt Zugang zum Kursbereich – kein Warten, kein Download. Einfach einloggen und loslegen.",
  },
  {
    q: "Gibt es eine Geld-zurück-Garantie?",
    a: "Ja. Wenn du nach 14 Tagen das Gefühl hast, dass der Kurs dir nicht geholfen hat, bekommst du dein Geld zurück – ohne Diskussion. Ich stehe hinter meinem Kurs.",
  },
  {
    q: "Wie kann ich bezahlen?",
    a: "Du kannst sicher per Kreditkarte, Debitkarte oder anderen gängigen Zahlungsmethoden bezahlen. Die Zahlung läuft über Stripe – sicher und verschlüsselt.",
  },
];

export default function Faq() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--cream)", color: "var(--foreground)", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ background: "var(--cream)", borderBottom: "1px solid var(--border)", padding: "0.85rem 0", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--teal)", textDecoration: "none" }}>
            ⚓ Mama-Hafen
          </Link>
          <Link href="/#kaufen">
            <button style={{
              background: "var(--coral)", color: "white", border: "none", borderRadius: 50,
              padding: "0.5rem 1.2rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: "0.85rem", cursor: "pointer",
            }}>
              Jetzt kaufen
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "var(--teal)", padding: "4rem 0 3rem", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <FadeUp>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "0.6rem" }}>
              Häufige Fragen
            </p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 5vw, 2.6rem)", color: "white", lineHeight: 1.2, marginBottom: "1rem" }}>
              Fragen, die ich wirklich oft bekomme.
            </h1>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.75 }}>
              Ehrliche Antworten – ohne Marketing-Sprech.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <FadeUp>
            <div>
              {faqs.map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} defaultOpen={f.defaultOpen} />
              ))}
            </div>
          </FadeUp>

          {/* CTA */}
          <FadeUp delay={200}>
            <div style={{ textAlign: "center", marginTop: "3.5rem", padding: "2.5rem", background: "white", borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", marginBottom: "0.8rem" }}>
                Noch eine Frage offen?
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                Schreib mir direkt – ich antworte persönlich.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="mailto:info@darvismedia.de" style={{
                  display: "inline-block", background: "var(--teal)", color: "white", borderRadius: 50,
                  padding: "0.75rem 1.8rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                  fontSize: "0.95rem", textDecoration: "none",
                }}>
                  E-Mail schreiben
                </a>
                <Link href="/#kaufen">
                  <button style={{
                    background: "var(--coral)", color: "white", border: "none", borderRadius: 50,
                    padding: "0.75rem 1.8rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                    fontSize: "0.95rem", cursor: "pointer",
                  }}>
                    Jetzt kaufen ⚓
                  </button>
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--teal)", padding: "2rem 0", textAlign: "center" }}>
        <div className="container">
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", margin: 0 }}>
            © {new Date().getFullYear()} Mama-Hafen · <Link href="/impressum" style={{ color: "rgba(255,255,255,0.7)" }}>Impressum</Link> · <Link href="/datenschutz" style={{ color: "rgba(255,255,255,0.7)" }}>Datenschutz</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
