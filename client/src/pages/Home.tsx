/**
 * MAMA-HAFEN LANDINGPAGE – Redesign nach neuem Desktop-HTML
 * Design: Creme + Teal + Coral, Serif Headlines, viel Whitespace
 * Alle Funktionen (Checkout, Video, FAQ, Exit-Popup) bleiben erhalten
 */

import { useEffect, useRef, useState } from "react";
import { Instagram, Youtube } from "lucide-react";
import { StripeCheckoutModal } from "@/components/StripeCheckoutModal";

const IMG_DARLEEN = "/manus-storage/darleen-profile-new_a8e2e5c7.webp";

// ── Scroll-Animation ─────────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`fade-up ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid var(--border)", padding: "1.1rem 0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          textAlign: "left",
          background: "none",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "0.8rem",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: "var(--foreground)",
          padding: 0,
          lineHeight: 1.5,
        }}
      >
        <span style={{ flex: 1 }}>{q}</span>
        <span
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: open ? "var(--teal)" : "var(--sand)",
            color: open ? "white" : "var(--teal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            fontWeight: 700,
            transition: "all 0.2s",
            marginTop: "0.1rem",
          }}
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p
          style={{
            marginTop: "0.75rem",
            color: "var(--muted-foreground)",
            lineHeight: 1.75,
            fontSize: "0.93rem",
          }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

const modules = [
  { num: "01", title: "Begrüßung & Überblick", min: 5 },
  { num: "02", title: "Ist mein Kind ein kleiner Tyrann?", min: 8 },
  { num: "03", title: "Die Autonomiephase verstehen", min: 9 },
  { num: "04", title: "Die Illusion der Wahl", min: 12 },
  { num: "05", title: "Das Führungsparadox", min: 7 },
  { num: "06", title: "Erste Hilfe bei Wutanfällen", min: 7 },
  { num: "07", title: "Zen-Mama: Empathie & Gelassenheit", min: 12 },
  { num: "08", title: "Frustrationstoleranz stärken", min: 7 },
  { num: "09", title: "Wutanfälle in der Öffentlichkeit", min: 10 },
  { num: "10", title: "Bindungsorientiert erziehen", min: 10 },
  { num: "11", title: "Abschluss & Ausblick", min: 5 },
];

const faqs = [
  {
    q: "Wie lange habe ich Zugang?",
    a: "Einmal kaufen, für immer behalten – auch wenn dein zweites Kind in die Trotzphase kommt.",
    defaultOpen: true,
  },
  {
    q: "Muss ich viel Zeit investieren?",
    a: "Nein – und das war mir extrem wichtig. Jede Lektion ist 5 bis 12 Minuten kurz. Du kannst den Kurs in winzigen Häppchen absolvieren – beim Stillen, in der Bahn oder abends auf dem Sofa.",
  },
  {
    q: "Wann bekomme ich Zugang?",
    a: "Sofort! Nach erfolgreicher Zahlung erhältst du direkt Zugang zum Kursbereich – kein Warten, kein Download.",
  },
  {
    q: "Ist der Ansatz zu 'weich'? Ich möchte meinem Kind trotzdem Grenzen setzen.",
    a: "Bindungsorientiert bedeutet nicht grenzenlos! Du lernst hier, wie du klare und liebevolle Grenzen setzt – ohne Schreien, ohne Strafen und ohne Machtkampf.",
  },
  {
    q: "Funktioniert das wirklich bei meinem Kind?",
    a: "Die Grundprinzipien der Autonomiephase und der Gehirnentwicklung gelten für alle Kinder in diesem Alter. Wenn du verstehst, was wirklich in deinem Kind vorgeht, verändert sich deine Reaktion. Und wenn du dich veränderst, verändert sich dein Kind.",
  },
  {
    q: "Für welches Alter ist der Kurs geeignet?",
    a: "Der Kurs ist für Mamas von Kindern zwischen 1,5 und 6 Jahren konzipiert – der klassischen Autonomiephase.",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [navScrolled, setNavScrolled] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<string | null>(null);
  const [exitPopupVisible, setExitPopupVisible] = useState(false);
  const exitPopupShown = useRef(false);

  // UTM-Parameter aus URL lesen (einmalig beim Laden)
  const utmParams = (() => {
    const p = new URLSearchParams(window.location.search);
    return {
      utmSource: p.get("utm_source") || "",
      utmMedium: p.get("utm_medium") || "",
      utmCampaign: p.get("utm_campaign") || "",
    };
  })();

  const handleKaufen = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/stripe/create-embedded-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, origin: window.location.origin, ...utmParams }),
      });
      const data = await res.json() as { clientSecret?: string; error?: string };
      if (data.clientSecret) {
        setCheckoutClientSecret(data.clientSecret);
      } else {
        setCheckoutError(data.error || "Fehler beim Checkout. Bitte versuche es erneut.");
      }
    } catch {
      setCheckoutError("Verbindungsfehler. Bitte versuche es erneut.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Exit-Intent: Desktop
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !exitPopupShown.current) {
        exitPopupShown.current = true;
        setExitPopupVisible(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  // Exit-Intent: Mobile
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !exitPopupShown.current) {
        exitPopupShown.current = true;
        setTimeout(() => setExitPopupVisible(true), 300);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--cream)", color: "var(--foreground)" }}>

      {/* ── NAV ── */}
      <nav
        className={navScrolled ? "nav-scrolled" : "nav-top"}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "all 0.3s ease" }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 1.5rem" }}>
          <span style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 700,
            fontSize: "clamp(1rem, 3vw, 1.2rem)",
            color: "var(--teal)",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}>
            ⚓ Mama-Hafen
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }} className="nav-social-proof">
              ★★★★★ 120.000+ Mamas
            </span>
            <button
              className="btn-coral"
              onClick={() => scrollTo("kaufen")}
              style={{ padding: "0.55rem 1.3rem", fontSize: "0.88rem" }}
            >
              Jetzt für 99 €
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: "5rem", background: "var(--cream)" }}>
        <div className="container">
          <div className="hero-grid">
            {/* Text-Spalte */}
            <div className="hero-text">
              <FadeUp>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "var(--teal)",
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  padding: "0.35rem 1rem",
                  borderRadius: 50,
                  marginBottom: "1.4rem",
                }}>
                  ⚓ Für Mamas von Kindern 1,5–6 Jahren
                </span>
              </FadeUp>
              <FadeUp delay={80}>
                <h1 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                  lineHeight: 1.12,
                  color: "var(--foreground)",
                  marginBottom: "1.2rem",
                  fontWeight: 700,
                }}>
                  Stell dir einen Morgen vor, an dem niemand schreit.{" "}
                  <em style={{ color: "var(--teal)", fontStyle: "italic" }}>Auch nicht du.</em>
                </h1>
              </FadeUp>
              <FadeUp delay={160}>
                <p style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.75,
                  color: "var(--muted-foreground)",
                  marginBottom: "2rem",
                  maxWidth: 480,
                }}>
                  Kein Kampf beim Anziehen. Kein Drama beim Frühstück. Nur dein Kind, das kooperiert – und du, die sich endlich wieder wie eine gute Mama fühlt.
                </p>
              </FadeUp>
              <FadeUp delay={240}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.8rem" }}>
                  <button
                    className="btn-coral"
                    onClick={() => scrollTo("kaufen")}
                    style={{ fontSize: "1.05rem", padding: "0.9rem 2rem", fontWeight: 900, alignSelf: "flex-start" }}
                  >
                    🎁 Jetzt für 99 € sichern (277 € Wert)
                  </button>
                  <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                    <span>★★★★★ 120.000+ Mamas</span>
                    <span>🛡️ 7-Tage Geld-Zurück Garantie</span>
                    <span>⚡ Sofort-Zugang</span>
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Video-Spalte */}
            <FadeUp delay={180} className="hero-video-wrap">
              <div style={{
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0,0,0,0.16)",
                aspectRatio: "4/5",
                background: "#000",
                position: "relative",
              }}>
                <iframe
                  src="https://iframe.mediadelivery.net/embed/655693/04954a8d-6668-4219-bf6b-7b8b127e882d?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title="Mama-Hafen Hero Video"
                />
                <div style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 50,
                  padding: "0.4rem 1rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  whiteSpace: "nowrap",
                }}>
                  ▶ Schau dir in 90 Sekunden an, wie der Kurs funktioniert
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <section style={{ background: "var(--sand)", padding: "1.5rem 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ color: "#f59e0b", fontSize: "1rem" }}>★★★★★</span>
            <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              Die Mamaleen Community mit mehr als{" "}
              <strong style={{ color: "var(--teal)" }}>120.000+ Eltern</strong>
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <a
              href="https://www.instagram.com/mamaleen_official/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                background: "white", border: "1px solid var(--border)",
                borderRadius: 8, padding: "0.4rem 0.9rem",
                fontSize: "0.82rem", fontWeight: 600, color: "var(--foreground)",
                textDecoration: "none",
              }}
            >
              <Instagram size={14} /> Instagram
            </a>
            <a
              href="https://www.youtube.com/@mamaleen_official"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                background: "white", border: "1px solid var(--border)",
                borderRadius: 8, padding: "0.4rem 0.9rem",
                fontSize: "0.82rem", fontWeight: 600, color: "var(--foreground)",
                textDecoration: "none",
              }}
            >
              <Youtube size={14} /> YouTube
            </a>
          </div>
        </div>
      </section>

      {/* ── ÜBER DARLEEN ── */}
      <section style={{ background: "var(--cream)", padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: 820 }}>
          {/* Darleen-Profil */}
          <FadeUp>
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "3rem" }}>
              <img
                src={IMG_DARLEEN}
                alt="Darleen – Mamaleen"
                style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--teal)", flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>Darleen · „Mamaleen"</div>
                <div style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Mama von zwei · Gründerin Mama-Hafen</div>
                <div style={{ fontSize: "0.8rem", color: "var(--teal)", marginTop: "0.2rem", fontWeight: 600 }}>
                  📷 🎬 120.000+ Follower
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              lineHeight: 1.2,
              color: "var(--foreground)",
              marginBottom: "1.5rem",
              fontWeight: 700,
            }}>
              Ich saß abends in der Küche und weinte, weil ich mich als Mutter nicht mehr wiedererkannt habe und mich fragte, ob ich überhaupt fähig wäre, eine gute Mutter zu sein.
            </h2>
          </FadeUp>

          <FadeUp delay={120}>
            <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "var(--muted-foreground)", marginBottom: "1.2rem" }}>
              Als am Abend mein Kind die letzte Stunde vor dem Einschlafen damit verbracht hat, vor Trotz sich die Seele aus dem Leibe zu schreien, und keiner der typischen Ratgeber-Tipps half, passierte es wieder. Ich wurde laut, verzweifelt. Habe im Grunde aus meiner eigenen Machtlosigkeit das Verhalten meines Sohnes gespiegelt. Und in genau diesem Moment schoss mir ein Gedanke durch den Kopf, der wehtat:{" "}
              <em style={{ color: "var(--foreground)", fontStyle: "italic" }}>„Warum muss das Mamaleben so verdammt anstrengend sein? Ich kann und will nicht mehr!"</em>
            </p>
          </FadeUp>

          <FadeUp delay={160}>
            <div style={{
              background: "var(--sand)",
              borderLeft: "4px solid var(--teal)",
              borderRadius: "0 12px 12px 0",
              padding: "1.2rem 1.5rem",
              marginBottom: "1.2rem",
            }}>
              <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--foreground)", fontStyle: "italic", margin: 0 }}>
                Heute sieht mein Alltag ganz anders aus. Und das nicht, weil sich meine Kinder geändert haben – die sind immer noch in der Trotzphase – sondern weil mein Blick und meine Reaktion die ganze Energie dieser Trotzsituation schon bevor sie eskalieren entschärfen und ich dem Kind die sichere Anlaufstelle und der Hafen sein kann, die es in dem Moment braucht. Und das ohne sich selbst darin zu verlieren!
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={200}>
            <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "var(--muted-foreground)" }}>
              Aus diesem Grund möchte ich dir, die du genauso mit dieser Phase des Kindes überfordert bist, wie ich es war, meine Werkzeuge und Tools an die Hand geben, die bei mir im Alltag diese Veränderung gebracht haben, damit auch für dich das Mama-Sein wieder eine Freude sein kann und du deinen Familienalltag mit Leichtigkeit bewältigen kannst!
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── TRANSFORMATION ── */}
      <section style={{ background: "var(--sand)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              textAlign: "center",
              marginBottom: "3rem",
              color: "var(--foreground)",
            }}>
              Von Überleben zu Genießen
            </h2>
          </FadeUp>

          <div className="transform-grid">
            {/* Heute */}
            <FadeUp delay={80}>
              <div style={{
                background: "white",
                borderRadius: 16,
                padding: "1.8rem",
                border: "1px solid var(--border)",
              }}>
                <div style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted-foreground)",
                  marginBottom: "1.2rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid var(--border)",
                }}>
                  Dein Alltag heute
                </div>
                {[
                  "Du wirst aus Verzweiflung laut – und fühlst dich danach schuldig.",
                  "Jedes 'Nein' wird zum stundenlangen Machtkampf, der dir deine ganze Energie und Freude raubt!",
                  "Du hast Angst, mit deinem Kind einkaufen zu gehen, weil du im Supermarkt schon den nächsten Wutanfall befürchtest.",
                  "Abends liegst du oft ausgelaugt und mit Tränen in den Augen auf der Couch und fragst dich, warum es so anstrengend ist.",
                ].map((text, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: "0.1rem" }}>😔</span>
                    <p style={{ margin: 0, fontSize: "0.93rem", lineHeight: 1.65, color: "var(--muted-foreground)" }}>{text}</p>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* Pfeil */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: "var(--teal)" }}>
              →
            </div>

            {/* In 2 Wochen */}
            <FadeUp delay={160}>
              <div style={{
                background: "var(--teal)",
                borderRadius: 16,
                padding: "1.8rem",
              }}>
                <div style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "1.2rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                }}>
                  Dein Alltag in 2 Wochen
                </div>
                {[
                  "Du bleibst ruhig – auch wenn's schwierig wird.",
                  "Du setzt klare Grenzen und dein Kind akzeptiert diese ohne Kampf.",
                  "Beim nächsten Wutanfall weißt du genau, was zu tun ist, um die Situation schnell und ohne stundenlanges Schreien zu lösen.",
                  "Du genießt das Mamasein in vollen Zügen! Dein Familienalltag lässt dich wieder auftanken, statt dich leerzusaugen!",
                ].map((text, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: "0.1rem" }}>💚</span>
                    <p style={{ margin: 0, fontSize: "0.93rem", lineHeight: 1.65, color: "rgba(255,255,255,0.92)" }}>{text}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── KURSSTRUKTUR ── */}
      <section style={{ background: "var(--cream)", padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <FadeUp>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              textAlign: "center",
              marginBottom: "0.75rem",
              color: "var(--foreground)",
            }}>
              So kommst du dahin
            </h2>
            <p style={{ textAlign: "center", color: "var(--muted-foreground)", marginBottom: "3rem", fontSize: "0.95rem" }}>
              11 Video-Lektionen · je 5–12 Min. · in deinem Tempo
            </p>
          </FadeUp>

          <div className="steps-grid">
            {[
              { num: "1", title: "Verstehen, was wirklich passiert", desc: "Die Autonomiephase & die Gehirnentwicklung deines Kindes." },
              { num: "2", title: "Anders reagieren lernen", desc: "Erste Hilfe bei Wutanfällen, Grenzen ohne Machtkampf." },
              { num: "3", title: "Dranbleiben & wachsen", desc: "Workbook + wöchentliche Praxisvideos aus der Community." },
            ].map((step, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "1.8rem",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "var(--teal)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    marginBottom: "1rem",
                  }}>
                    {step.num}
                  </div>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.15rem", marginBottom: "0.5rem", color: "var(--foreground)" }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.65, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Zeitversprechen */}
          <FadeUp delay={240}>
            <div style={{
              background: "var(--sand)",
              borderRadius: 16,
              padding: "1.5rem 2rem",
              marginTop: "2rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
            }}>
              <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>⏱️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem" }}>Gemacht für Mamas ohne Zeit</div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.65 }}>
                  Du musst dir nicht mehr das stundenlange Wälzen von Ratgebern antun. Schau die Videos beim Stillen, in der Bahn oder abends auf dem Sofa.{" "}
                  <strong style={{ color: "var(--foreground)" }}>Die Lektionen sind so entwickelt worden, dass du mit nur 15 Minuten am Tag alles umsetzen kannst!</strong>
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── PRICING / KAUF ── */}
      <section id="kaufen" style={{ background: "var(--sand)", padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--coral)",
                marginBottom: "0.75rem",
              }}>
                Das Angebot
              </div>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "var(--foreground)",
                marginBottom: "0.5rem",
              }}>
                277 € Wert. Heute für 99 €.
              </h2>
            </div>
          </FadeUp>

          {/* Offer Stack */}
          <FadeUp delay={80}>
            <div style={{
              background: "white",
              borderRadius: 20,
              border: "2px solid var(--border)",
              overflow: "hidden",
              marginBottom: "1.5rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
            }}>
              {[
                { label: "Kern:", title: "11 Video-Module zur Autonomiephase", desc: "Von 'Erste Hilfe bei Wutanf\u00e4llen' bis 'Grenzen ohne Machtkampf'.", value: "149 \u20ac" },
           { label: "Bonus 1:", title: "'Zen-Mama' Praxis-Workbook", desc: "L\u00f6st: Ich krieg's im Alltag nicht angewendet.", value: "29 \u20ac" },
             { label: "Bonus 2:", title: "'Aus eurem Alltag' \u2013 w\u00f6chentliche Praxisvideos", desc: "L\u00f6st: Mein Kind ist aber speziell. Der Kurs w\u00e4chst mit.", value: "99 \u20ac" },    { label: "Bonus 3:", title: "Lifetime-Zugang", desc: "L\u00f6st: Was, wenn das 2. Kind in die Phase kommt?", value: "\u221e" },           ].map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem 1.5rem",
                  borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", color: "var(--foreground)", lineHeight: 1.5 }}>
                      <strong>{item.label}</strong> {item.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.2rem" }}>{item.desc}</div>
                  </div>
                  <div style={{ flexShrink: 0, fontWeight: 800, fontSize: "0.9rem", color: "var(--teal)", whiteSpace: "nowrap" }}>{item.value}</div>
                </div>
              ))}
              {/* Gesamtpreis */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.5rem",
                background: "var(--sand)",
                borderTop: "2px solid var(--border)",
              }}>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textDecoration: "line-through" }}>277 €</div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Dein Preis heute</div>
                </div>
                <div style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "2.4rem",
                  fontWeight: 700,
                  color: "var(--teal)",
                }}>99 €</div>
              </div>
            </div>
          </FadeUp>

          {/* Kauf-Formular */}
          <FadeUp delay={120}>
            <div className="waitlist-card" style={{
              background: "white",
              borderRadius: 20,
              padding: "2rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
              border: "1px solid var(--border)",
            }}>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <button
                    type="button"
                    onClick={handleKaufen}
                    disabled={checkoutLoading}
                    className="waitlist-btn"
                    style={{
                      width: "100%",
                      background: checkoutLoading ? "#aaa" : "var(--coral)",
                      color: "white",
                      border: "none",
                      borderRadius: 12,
                      padding: "0.9rem",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: "1rem",
                      cursor: checkoutLoading ? "not-allowed" : "pointer",
                      transition: "background 0.2s, transform 0.15s",
                    }}
                    onMouseEnter={e => {
                      if (!checkoutLoading) {
                        (e.currentTarget as HTMLButtonElement).style.background = "var(--coral-dark)";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!checkoutLoading) {
                        (e.currentTarget as HTMLButtonElement).style.background = "var(--coral)";
                        (e.currentTarget as HTMLButtonElement).style.transform = "";
                      }
                    }}
                  >
                    {checkoutLoading ? "⏳ Weiterleitung..." : "🎁 Jetzt Kurs kaufen"}
                  </button>
                  {checkoutError && (
                    <p style={{ color: "#c0392b", fontSize: "0.85rem", textAlign: "center" }}>
                      {checkoutError}
                    </p>
                  )}
                  <div style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                    🔒 Sichere Zahlung über Stripe · Einmalzahlung, kein Abo
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Garantie */}
          <FadeUp delay={160}>
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: "1.5rem 2rem",
              marginTop: "1.5rem",
              border: "1px solid var(--border)",
              display: "flex",
              gap: "1.2rem",
              alignItems: "flex-start",
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--teal)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                flexShrink: 0,
              }}>
                🛡️
              </div>
              <div>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", marginBottom: "0.4rem", color: "var(--teal)" }}>
                  Die 7-Tage Geld-Zurück Garantie
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.7 }}>
                  Teste den Kurs 7 Tage. Wenn du nicht das Gefühl hast, in hitzigen Momenten ruhiger zu bleiben, schreib mir eine kurze E-Mail – du bekommst{" "}
                  <strong style={{ color: "var(--foreground)" }}>100 % zurück</strong>. Ohne Wenn und Aber.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── MODULE ── */}
      <section id="kurs" style={{ background: "var(--cream)", padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <FadeUp>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
              textAlign: "center",
              marginBottom: "0.5rem",
              color: "var(--foreground)",
            }}>
              11 kurze Lektionen. Direkt umsetzbar.
            </h2>
            <p style={{ textAlign: "center", color: "var(--muted-foreground)", marginBottom: "2.5rem", fontSize: "0.9rem" }}>
              Je 5–12 Minuten – für echte Alltagssituationen.
            </p>
          </FadeUp>

          <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
            {modules.map((mod, i) => (
              <div
                key={mod.num}
                className="module-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.9rem 1.4rem",
                  borderBottom: i < modules.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div
                  className="module-num"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: "var(--teal)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {mod.num}
                </div>
                <div className="module-title" style={{ flex: 1, fontWeight: 600, fontSize: "0.93rem" }}>
                  {mod.title}
                </div>
                <div
                  className="module-time"
                  style={{
                    background: "var(--sand)",
                    color: "var(--muted-foreground)",
                    borderRadius: 50,
                    padding: "0.2rem 0.65rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {mod.min} Min.
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: "var(--sand)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
              textAlign: "center",
              marginBottom: "3rem",
              color: "var(--foreground)",
            }}>
              Das sagen Mamas, die dabei sind
            </h2>
          </FadeUp>

          <div className="testimonials-grid">
            {[
              { text: '"Die praktischen Beispiele konnte ich direkt anwenden – man weiß sofort, was gemeint ist."', name: "Nina K., Mama eines 3-Jährigen" },
              { text: '"Seitdem fallen ihr die Entscheidungen leichter. Das hat sich sofort verändert."', name: "Julia W., Mama von drei Kindern" },
              { text: '"Der Kurs hat mich neu motiviert – neue Perspektiven, super in den Alltag integrierbar."', name: "Melanie S., Mama von zwei Kindern" },
            ].map((t, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "1.8rem",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ color: "#f59e0b", fontSize: "1rem", marginBottom: "0.75rem" }}>★★★★★</div>
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "var(--foreground)", marginBottom: "1rem", fontStyle: "italic" }}>
                    {t.text}
                  </p>
                  <div style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", fontWeight: 600 }}>— {t.name}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "var(--cream)", padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <FadeUp>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
              textAlign: "center",
              marginBottom: "2.5rem",
              color: "var(--foreground)",
            }}>
              Fragen, die ich oft bekomme
            </h2>
          </FadeUp>

          <div className="faq-card" style={{
            background: "white",
            borderRadius: 20,
            padding: "1.5rem 2rem",
            border: "1px solid var(--border)",
          }}>
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} defaultOpen={faq.defaultOpen} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: "var(--teal)", padding: "5rem 0" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 620 }}>
          <FadeUp>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "white",
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}>
              Du bist es wert, eine freudige Mama zu sein. Fang noch heute damit an!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", marginBottom: "2rem" }}>
              Kein Abo. Kein Druck. 7 Tage Geld-zurück-Garantie.
            </p>
            <button
              className="btn-coral"
              onClick={() => scrollTo("kaufen")}
              style={{ fontSize: "1.1rem", padding: "1rem 2.5rem", fontWeight: 900 }}
            >
              Jetzt Kurs kaufen ⚓
            </button>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "var(--foreground)",
        color: "rgba(255,255,255,0.6)",
        padding: "2rem 0",
        textAlign: "center",
        fontSize: "0.82rem",
      }}>
        <div className="container">
          <div style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            ⚓ Mama-Hafen
          </div>
          <div>© 2026 · Ein Kurs von Mamaleen</div>
          <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "center", gap: "1.5rem" }}>
            <a href="/impressum" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Impressum</a>
            <a href="/datenschutz" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Datenschutz</a>
          </div>
        </div>
      </footer>

      {/* ── EXIT-INTENT POPUP ── */}
      {exitPopupVisible && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setExitPopupVisible(false); }}
        >
          <div style={{
            background: "var(--cream)",
            borderRadius: 24,
            padding: "2.5rem 2rem 2rem",
            maxWidth: 440,
            width: "100%",
            position: "relative",
            boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
            textAlign: "center",
          }}>
            <button
              onClick={() => setExitPopupVisible(false)}
              style={{
                position: "absolute", top: "1rem", right: "1rem",
                background: "none", border: "none", cursor: "pointer",
                fontSize: "1.4rem", color: "var(--muted-foreground)",
                lineHeight: 1, padding: "0.2rem 0.4rem",
              }}
              aria-label="Schließen"
            >×</button>
            <div style={{ fontSize: "2.8rem", marginBottom: "0.8rem" }}>⚓</div>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.5rem",
              color: "var(--foreground)",
              lineHeight: 1.25,
              marginBottom: "0.75rem",
            }}>
              Noch nicht bereit?
            </h2>
            <p style={{
              fontSize: "0.95rem",
              color: "var(--muted-foreground)",
              lineHeight: 1.7,
              marginBottom: "1.75rem",
            }}>
              Kein Problem. Ich teile jede Woche kostenlose Tipps für die Autonomiephase auf Instagram und YouTube – damit du auch ohne den Kurs schon erste Hilfe bekommst.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a
                href="https://www.instagram.com/mamaleen_official/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                  background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  color: "white", borderRadius: 50, padding: "0.8rem 1.5rem",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem",
                  textDecoration: "none", boxShadow: "0 4px 16px rgba(220,39,67,0.3)",
                }}
              >
                <Instagram size={20} /> Auf Instagram folgen
              </a>
              <a
                href="https://www.youtube.com/@mamaleen_official"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                  background: "#FF0000", color: "white", borderRadius: 50, padding: "0.8rem 1.5rem",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem",
                  textDecoration: "none", boxShadow: "0 4px 16px rgba(255,0,0,0.3)",
                }}
              >
                <Youtube size={20} /> Auf YouTube folgen
              </a>
            </div>
            <button
              onClick={() => setExitPopupVisible(false)}
              style={{
                marginTop: "1.25rem", background: "none", border: "none", cursor: "pointer",
                fontSize: "0.82rem", color: "var(--muted-foreground)", textDecoration: "underline",
              }}
            >
              Nein danke, ich brauche keine Hilfe
            </button>
          </div>
        </div>
      )}

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        .nav-top {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 var(--border);
        }
        .nav-scrolled {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(12px);
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
        }
        .nav-social-proof { display: none; }

        /* Hero Grid */
        .hero-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 2rem 0 3rem;
        }
        .hero-text { width: 100%; }
        .hero-video-wrap { width: 100%; }

        /* Transform Grid */
        .transform-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .transform-grid > div:nth-child(2) { display: none; }

        /* Steps Grid */
        .steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        /* Testimonials Grid */
        .testimonials-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.2rem;
        }

        /* Kauf-Karte */
        .waitlist-card { padding: 1.5rem 1.2rem !important; border-radius: 16px !important; }
        .waitlist-input { padding: 0.8rem 0.9rem 0.8rem 2.4rem !important; font-size: 0.9rem !important; border-radius: 10px !important; }
        .waitlist-btn { padding: 0.85rem !important; font-size: 0.92rem !important; border-radius: 10px !important; }

        /* Module */
        .module-row { padding: 0.7rem 1rem !important; gap: 0.65rem !important; }
        .module-num { width: 28px !important; height: 28px !important; font-size: 0.7rem !important; }
        .module-title { font-size: 0.85rem !important; }
        .module-time { font-size: 0.7rem !important; padding: 0.12rem 0.45rem !important; }

        /* FAQ */
        .faq-card { padding: 1rem 1.2rem !important; border-radius: 16px !important; }

        /* Tablet */
        @media (min-width: 640px) {
          .steps-grid { grid-template-columns: repeat(3, 1fr); }
          .testimonials-grid { grid-template-columns: repeat(3, 1fr); }
          .transform-grid {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 1.5rem;
          }
          .transform-grid > div:nth-child(2) { display: flex; }
        }

        /* Desktop */
        @media (min-width: 768px) {
          .nav-social-proof { display: inline; }
          .hero-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
            padding: 3rem 0 4rem;
          }
          .hero-video-wrap { width: auto; }
          .waitlist-card { padding: 2rem !important; border-radius: 20px !important; }
          .waitlist-input { padding: 0.85rem 1rem 0.85rem 2.6rem !important; font-size: 0.95rem !important; border-radius: 12px !important; }
          .waitlist-btn { padding: 0.9rem !important; font-size: 1rem !important; border-radius: 12px !important; }
          .module-row { padding: 0.9rem 1.4rem !important; gap: 1rem !important; }
          .module-num { width: 34px !important; height: 34px !important; font-size: 0.75rem !important; }
          .module-title { font-size: 0.93rem !important; }
          .module-time { font-size: 0.75rem !important; }
          .faq-card { padding: 1.5rem 2rem !important; border-radius: 20px !important; }
        }
      `}</style>

      {/* ── STRIPE EMBEDDED CHECKOUT MODAL ── */}
      {checkoutClientSecret && (
        <StripeCheckoutModal
          clientSecret={checkoutClientSecret}
          onClose={() => {
            setCheckoutClientSecret(null);
            window.location.href = "/kauf/abbruch";
          }}
        />
      )}
    </div>
  );
}
