/**
 * /ueber-darleen – Über Darleen (Mamaleen)
 * Eigenständige Unterseite für Google Sitelinks
 */

import { useEffect, useRef } from "react";
import { Link } from "wouter";

const IMG_DARLEEN = "/manus-storage/darleen-profile-new_a8e2e5c7.webp";

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

export default function UeberDarleen() {
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
              Über Darleen
            </p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", color: "white", lineHeight: 1.2, marginBottom: "1rem" }}>
              Ich bin Darleen – und ich war genau da, wo du gerade bist.
            </h1>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.75 }}>
              Mama von zwei Kindern. Keine Expertin von Anfang an – sondern eine Mutter, die selbst durch die härteste Phase gegangen ist.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* STORY */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "3rem", alignItems: "start" }}>

            {/* Foto */}
            <FadeUp>
              <div style={{ position: "sticky", top: "5rem" }}>
                <img
                  src={IMG_DARLEEN}
                  alt="Darleen – Mama-Hafen"
                  style={{ width: "100%", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", aspectRatio: "3/4", objectFit: "cover" }}
                />
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "var(--teal)", margin: 0 }}>Darleen</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: "0.2rem 0 0" }}>Mama · Gründerin Mama-Hafen</p>
                </div>
              </div>
            </FadeUp>

            {/* Text */}
            <div>
              <FadeUp>
                <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "var(--muted-foreground)", marginBottom: "1.3rem" }}>
                  Als die Trotzphase bei meinem ersten Kind begann, wurde ich plötzlich zu einem Menschen, den ich kaum noch wiedererkannt habe. Ich wurde ständig laut, habe mich danach schuldig gefühlt – und abends lag ich völlig erschöpft auf der Couch und fragte mich: <em>Warum muss das Mamaleben so verdammt anstrengend sein?</em>
                </p>
              </FadeUp>

              <FadeUp delay={80}>
                <div style={{ background: "rgba(74,163,148,0.07)", borderLeft: "4px solid var(--teal)", borderRadius: "0 14px 14px 0", padding: "1.1rem 1.3rem", marginBottom: "1.3rem" }}>
                  <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "var(--muted-foreground)", margin: 0, fontStyle: "italic" }}>
                    Mein erster Schritt war es, zu verstehen, <strong style={{ color: "var(--foreground)" }}>was in meinen Kindern wirklich vorgeht</strong> und wie sich <strong style={{ color: "var(--foreground)" }}>das Gehirn von Kindern entwickelt</strong>. Plötzlich ergab alles einen Sinn – und ich habe verstanden, dass die Autonomiephase <strong style={{ color: "var(--foreground)" }}>kein Problem ist, das man "austreiben" muss</strong>, sondern ein wichtiger Entwicklungsschritt.
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={120}>
                <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "var(--muted-foreground)", marginBottom: "1.3rem" }}>
                  Ich habe viele Expertentipps selbst ausprobiert, verworfen und die besten zusammengetragen. Heute starten wir ruhig in den Tag, die Kinder kooperieren – und ich kann das Mamasein endlich genießen.
                </p>
              </FadeUp>

              <FadeUp delay={160}>
                <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "var(--muted-foreground)", marginBottom: "1.8rem" }}>
                  Genau deshalb habe ich den Mama-Hafen Kurs entwickelt: Damit du nicht selbst alle Ratgeber durchforsten musst, sondern schon morgen wieder die Mama sein kannst, die du sein möchtest.
                </p>
              </FadeUp>

              {/* Stats */}
              <FadeUp delay={200}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                  {[
                    { num: "2", label: "eigene Kinder" },
                    { num: "11", label: "Kurs-Module" },
                    { num: "1.000+", label: "Mamas geholfen" },
                    { num: "∞", label: "Zugang nach Kauf" },
                  ].map(s => (
                    <div key={s.label} style={{ background: "white", borderRadius: 14, padding: "1.1rem", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.6rem", color: "var(--teal)" }}>{s.num}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.2rem" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </FadeUp>

              <FadeUp delay={240}>
                <Link href="/#kaufen">
                  <button style={{
                    background: "var(--coral)", color: "white", border: "none", borderRadius: 50,
                    padding: "0.85rem 2rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                    fontSize: "1rem", cursor: "pointer", width: "100%",
                  }}>
                    Jetzt Kurs kaufen ⚓
                  </button>
                </Link>
              </FadeUp>
            </div>
          </div>
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
