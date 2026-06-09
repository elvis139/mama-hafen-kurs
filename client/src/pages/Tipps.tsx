/**
 * /tipps – Kostenlose Tipps mit Instagram/YouTube-Verweis
 * Eigenständige Unterseite für Google Sitelinks
 */

import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { Instagram, Youtube } from "lucide-react";

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

const tipps = [
  {
    icon: "🧘",
    title: "Ruhig bleiben in 10 Sekunden",
    text: "Wenn der Wutanfall kommt: Tief einatmen, innerlich bis 5 zählen und bewusst die Schultern senken. Dein Körper signalisiert deinem Kind: Hier ist Sicherheit.",
  },
  {
    icon: "🤝",
    title: "Die Wahl-Technik",
    text: "Statt \"Zieh deine Jacke an!\" lieber: \"Möchtest du die rote oder die blaue Jacke?\" Dein Kind fühlt sich gehört – und du behältst die Kontrolle.",
  },
  {
    icon: "💬",
    title: "Gefühle benennen",
    text: "\"Du bist gerade sehr wütend, weil...\" – wenn du das Gefühl deines Kindes in Worte fasst, fühlt es sich verstanden. Das allein kann einen Wutanfall halbieren.",
  },
  {
    icon: "⏱️",
    title: "Übergänge ankündigen",
    text: "\"In 5 Minuten gehen wir.\" Kinder brauchen Vorwarnung. Ohne sie fühlt sich jeder Wechsel wie ein Überfall an – und der Widerstand ist vorprogrammiert.",
  },
  {
    icon: "🌊",
    title: "Den Sturm durchsitzen",
    text: "Manchmal ist das Beste, was du tun kannst: Da sein. Nicht reden, nicht erklären – einfach ruhig bleiben und warten, bis der Sturm sich legt.",
  },
  {
    icon: "❤️",
    title: "Verbindung vor Korrektur",
    text: "Erst verbinden, dann korrigieren. Ein kurzer Moment der Nähe – eine Hand auf der Schulter, Augenkontakt – macht dein Kind empfänglicher für das, was du sagst.",
  },
];

export default function Tipps() {
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
              Kostenlose Tipps
            </p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 5vw, 2.6rem)", color: "white", lineHeight: 1.2, marginBottom: "1rem" }}>
              6 Tipps für die Autonomiephase – sofort umsetzbar.
            </h1>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.75 }}>
              Noch mehr kostenlose Tipps gibt es jede Woche auf Instagram und YouTube.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* TIPPS */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
            {tipps.map((t, i) => (
              <FadeUp key={t.title} delay={i * 60}>
                <div style={{
                  background: "white", borderRadius: 18, padding: "1.6rem",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.06)", height: "100%",
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{t.icon}</div>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", marginBottom: "0.6rem" }}>{t.title}</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.7, margin: 0 }}>{t.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Social Follow */}
          <FadeUp delay={400}>
            <div style={{ background: "var(--sand)", borderRadius: 24, padding: "2.5rem", textAlign: "center" }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.6rem", marginBottom: "0.8rem" }}>
                Noch mehr kostenlose Tipps
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.75, marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem" }}>
                Ich teile jede Woche praktische Tipps für die Autonomiephase auf Instagram und YouTube. Folge mir, um nichts zu verpassen.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href="https://www.instagram.com/mamaleen_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.55rem",
                    background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                    color: "white", borderRadius: 50, padding: "0.85rem 1.8rem",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem",
                    textDecoration: "none", boxShadow: "0 4px 16px rgba(220,39,67,0.25)",
                  }}
                >
                  <Instagram size={18} />
                  @mamaleen_official
                </a>
                <a
                  href="https://www.youtube.com/@mamaleen_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.55rem",
                    background: "#FF0000", color: "white", borderRadius: 50,
                    padding: "0.85rem 1.8rem", fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(255,0,0,0.22)",
                  }}
                >
                  <Youtube size={18} />
                  mamaleen_official
                </a>
              </div>
            </div>
          </FadeUp>

          {/* Kurs CTA */}
          <FadeUp delay={500}>
            <div style={{ textAlign: "center", marginTop: "3.5rem", padding: "2.5rem", background: "white", borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", marginBottom: "0.8rem" }}>
                Bereit für den nächsten Schritt?
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                Im Kurs bekommst du alle 11 Lektionen – strukturiert, tief und direkt umsetzbar.
              </p>
              <Link href="/#kaufen">
                <button style={{
                  background: "var(--coral)", color: "white", border: "none", borderRadius: 50,
                  padding: "0.9rem 2.5rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                  fontSize: "1.05rem", cursor: "pointer",
                }}>
                  Zum Kurs – 99 € ⚓
                </button>
              </Link>
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
