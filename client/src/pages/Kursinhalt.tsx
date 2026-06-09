/**
 * /kursinhalt – Die 11 Module im Detail
 * Eigenständige Unterseite für Google Sitelinks
 */

import { useEffect, useRef } from "react";
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

const modules = [
  { num: "01", title: "Begrüßung & Überblick", min: 5, desc: "Ein kurzer Überblick über den Kurs und was dich erwartet. Du weißt sofort, wie du die nächsten Wochen am besten nutzt." },
  { num: "02", title: "Ist mein Kind ein kleiner Tyrann?", min: 8, desc: "Warum dein Kind sich so verhält – und warum das nichts mit schlechter Erziehung zu tun hat. Ein echter Aha-Moment für viele Mamas." },
  { num: "03", title: "Die Autonomiephase verstehen", min: 9, desc: "Was im Kopf deines Kindes gerade wirklich passiert. Wenn du das verstehst, verändert sich alles – deine Reaktion, deine Geduld, dein Blick auf die Situation." },
  { num: "04", title: "Die Illusion der Wahl", min: 12, desc: "Eine der wirkungsvollsten Techniken überhaupt: Wie du deinem Kind das Gefühl gibst, selbst zu entscheiden – und trotzdem die Führung behältst." },
  { num: "05", title: "Das Führungsparadox", min: 7, desc: "Warum klare Grenzen dein Kind nicht einschränken, sondern ihm Sicherheit geben. Und wie du diese Grenzen liebevoll und konsequent durchhältst." },
  { num: "06", title: "Erste Hilfe bei Wutanfällen", min: 7, desc: "Was du in den nächsten 60 Sekunden tun kannst, wenn der Wutanfall kommt. Konkrete Schritt-für-Schritt-Anleitung für den Ernstfall." },
  { num: "07", title: "Zen-Mama: Empathie & Gelassenheit", min: 12, desc: "Wie du ruhig bleibst, auch wenn alles in dir schreit. Praktische Techniken, die du sofort anwenden kannst – auch wenn du gerade am Limit bist." },
  { num: "08", title: "Frustrationstoleranz stärken", min: 7, desc: "Wie du deinem Kind hilfst, mit Frust umzugehen – ohne es zu überwältigen oder zu verwöhnen. Der Schlüssel zu weniger Wutanfällen langfristig." },
  { num: "09", title: "Wutanfälle in der Öffentlichkeit", min: 10, desc: "Im Supermarkt, auf dem Spielplatz, bei Oma. Wie du auch dann ruhig und souverän reagierst, wenn alle zuschauen." },
  { num: "10", title: "Bindungsorientiert erziehen", min: 10, desc: "Was bindungsorientierte Erziehung wirklich bedeutet – und warum sie nicht weich oder grenzenlos ist, sondern das Fundament für eine starke Beziehung." },
  { num: "11", title: "Abschluss & Ausblick", min: 5, desc: "Ein persönliches Abschlusswort von mir und ein Ausblick: Was kommt nach der Autonomiephase? Und wie bleibst du auf dem richtigen Weg?" },
];

export default function Kursinhalt() {
  const totalMin = modules.reduce((s, m) => s + m.min, 0);

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
              Kursinhalt
            </p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 5vw, 2.6rem)", color: "white", lineHeight: 1.2, marginBottom: "1rem" }}>
              11 kurze Lektionen. Direkt umsetzbar.
            </h1>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Keine stundenlangen Monologe. Jede Lektion ist 5–12 Minuten lang und bringt dich direkt zur Praxis.
            </p>
            {/* Stats */}
            <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { num: "11", label: "Module" },
                { num: `${totalMin} Min`, label: "Gesamtlänge" },
                { num: "∞", label: "Zugang" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "white" }}>{s.num}</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* MODULE */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {modules.map((m, i) => (
              <FadeUp key={m.num} delay={i * 40}>
                <div style={{
                  background: "white", borderRadius: 16, padding: "1.4rem 1.6rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "1.2rem", alignItems: "start",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", background: "rgba(74,163,148,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.9rem", color: "var(--teal)", fontWeight: 700 }}>{m.num}</span>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.05rem", marginBottom: "0.35rem", color: "var(--foreground)" }}>{m.title}</h3>
                    <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
                  </div>
                  <div style={{
                    flexShrink: 0, background: "rgba(74,163,148,0.08)", borderRadius: 8,
                    padding: "0.25rem 0.6rem", fontSize: "0.78rem", color: "var(--teal)", fontWeight: 700, whiteSpace: "nowrap",
                  }}>
                    {m.min} Min
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* CTA */}
          <FadeUp delay={modules.length * 40 + 80}>
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <p style={{ fontSize: "1rem", color: "var(--muted-foreground)", marginBottom: "1.2rem", lineHeight: 1.7 }}>
                Einmalig kaufen – dauerhafter Zugang. Auch fürs zweite Kind.
              </p>
              <Link href="/#kaufen">
                <button style={{
                  background: "var(--coral)", color: "white", border: "none", borderRadius: 50,
                  padding: "0.9rem 2.5rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                  fontSize: "1.05rem", cursor: "pointer",
                }}>
                  Jetzt für 99 € sichern ⚓
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
