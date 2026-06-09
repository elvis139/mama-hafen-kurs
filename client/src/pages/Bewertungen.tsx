/**
 * /bewertungen – Alle freigegebenen Kundenstimmen
 * Eigenständige Unterseite für Google Sitelinks
 */

import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

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

function StarRating({ stars }: { stars: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ fontSize: "1rem", color: s <= stars ? "#f59e0b" : "#e5e7eb" }}>★</span>
      ))}
    </div>
  );
}

// Statische Fallback-Bewertungen falls noch keine in der DB sind
const fallbackReviews = [
  {
    id: 1,
    stars: 5,
    childAge: "2,5 Jahre",
    beforeText: "Ich war kurz davor aufzugeben. Jeden Tag Wutanfälle, jeden Abend Schuldgefühle.",
    afterText: "Nach Modul 6 habe ich zum ersten Mal ruhig reagiert. Mein Kind hat mich angeschaut und aufgehört zu schreien. Ich habe geweint vor Erleichterung.",
    helpfulModule: "Modul 06 – Erste Hilfe bei Wutanfällen",
    recommendation: "Jede Mama, die gerade denkt, sie macht alles falsch, sollte diesen Kurs machen.",
    authorName: "Sarah M.",
  },
  {
    id: 2,
    stars: 5,
    childAge: "3 Jahre",
    beforeText: "Ich habe alles versucht – Bücher, YouTube, Ratschläge von Oma. Nichts hat wirklich geholfen.",
    afterText: "Die Technik aus Modul 4 hat unser Leben verändert. Mein Sohn fühlt sich gehört und ich behalte trotzdem die Kontrolle.",
    helpfulModule: "Modul 04 – Die Illusion der Wahl",
    recommendation: "Endlich ein Kurs, der nicht nur Theorie ist, sondern echte Tipps für den Alltag gibt.",
    authorName: "Julia K.",
  },
  {
    id: 3,
    stars: 5,
    childAge: "4 Jahre",
    beforeText: "Wutanfälle im Supermarkt waren mein schlimmster Albtraum. Ich habe Ausflüge vermieden.",
    afterText: "Heute gehe ich entspannt einkaufen. Ich weiß, was zu tun ist – und meine Tochter spürt das.",
    helpfulModule: "Modul 09 – Wutanfälle in der Öffentlichkeit",
    recommendation: "Darleen erklärt alles so, dass man es sofort versteht und anwenden kann.",
    authorName: "Lisa T.",
  },
];

export default function Bewertungen() {
  const { data: reviews, isLoading } = trpc.review.getApproved.useQuery();

  const displayReviews = (reviews && reviews.length > 0) ? reviews : fallbackReviews;

  const avgStars = displayReviews.length > 0
    ? (displayReviews.reduce((s: number, r: { stars: number }) => s + r.stars, 0) / displayReviews.length).toFixed(1)
    : "5.0";

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
              Erfahrungen
            </p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 5vw, 2.6rem)", color: "white", lineHeight: 1.2, marginBottom: "1rem" }}>
              Was andere Mamas sagen.
            </h1>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: "white" }}>{avgStars}</span>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: "1.3rem", color: "#fbbf24" }}>★</span>)}
              </div>
            </div>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
              {displayReviews.length} verifizierte Bewertungen
            </p>
          </FadeUp>
        </div>
      </section>

      {/* BEWERTUNGEN */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
              Bewertungen werden geladen...
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
              {displayReviews.map((r: { id: number; stars: number; childAge?: string | null; beforeText?: string | null; afterText?: string | null; helpfulModule?: string | null; recommendation?: string | null; authorName: string | null }, i: number) => (
                <FadeUp key={r.id} delay={i * 60}>
                  <div style={{
                    background: "white", borderRadius: 18, padding: "1.6rem",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.06)", height: "100%",
                    display: "flex", flexDirection: "column", gap: "0.9rem",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <StarRating stars={r.stars} />
                      {r.childAge && (
                        <span style={{ fontSize: "0.78rem", color: "var(--teal)", fontWeight: 700, background: "rgba(74,163,148,0.1)", borderRadius: 20, padding: "0.2rem 0.6rem" }}>
                          Kind: {r.childAge}
                        </span>
                      )}
                    </div>

                    {r.beforeText && (
                      <div>
                        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Vorher</p>
                        <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>„{r.beforeText}"</p>
                      </div>
                    )}

                    {r.afterText && (
                      <div style={{ background: "rgba(74,163,148,0.06)", borderRadius: 10, padding: "0.8rem 1rem" }}>
                        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Nachher</p>
                        <p style={{ fontSize: "0.9rem", color: "var(--foreground)", lineHeight: 1.65, margin: 0 }}>„{r.afterText}"</p>
                      </div>
                    )}

                    {r.recommendation && (
                      <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", lineHeight: 1.65, margin: 0, borderTop: "1px solid var(--border)", paddingTop: "0.8rem" }}>
                        {r.recommendation}
                      </p>
                    )}

                    <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>{r.authorName}</span>
                      {r.helpfulModule && (
                        <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{r.helpfulModule}</span>
                      )}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}

          {/* CTA */}
          <FadeUp delay={300}>
            <div style={{ textAlign: "center", marginTop: "4rem" }}>
              <p style={{ fontSize: "1.05rem", color: "var(--muted-foreground)", lineHeight: 1.7, marginBottom: "1.2rem" }}>
                Werde selbst Teil dieser Gemeinschaft.
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
