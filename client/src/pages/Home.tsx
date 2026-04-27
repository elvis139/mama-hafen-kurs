/**
 * MAMA-HAFEN LANDINGPAGE – Mobile-optimierte Version
 * Design: "Coastal Calm" – DM Serif Display + DM Sans
 * Struktur: Hero → 3 Versprechen → Über Darleen → Kursmodule → CTA → FAQ
 */

import { useEffect, useRef, useState } from "react";

const IMG_HERO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663061854558/DswbdQTvMfJMPVPLtDLMpo/mama-hafen-hero-8D3s4D7uWWZgi4Fzfbffn2.webp";
const IMG_DARLEEN =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663061854558/DswbdQTvMfJMPVPLtDLMpo/mama-hafen-darleen-3tkZX2UvXKzMYVRCKEJYfg.webp";

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

// ── Wellen-Divider ────────────────────────────────────────────────────────────
function Wave({
  fill,
  bg = "transparent",
  flip = false,
}: {
  fill: string;
  bg?: string;
  flip?: boolean;
}) {
  return (
    <div style={{ background: bg, lineHeight: 0, overflow: "hidden" }}>
      <svg
        viewBox="0 0 1440 50"
        preserveAspectRatio="none"
        style={{
          display: "block",
          width: "100%",
          height: 40,
          transform: flip ? "scaleY(-1)" : "none",
        }}
      >
        <path
          d="M0,25 C480,50 960,0 1440,25 L1440,50 L0,50 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)", padding: "1rem 0" }}>
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
          fontSize: "0.95rem",
          color: "var(--foreground)",
          padding: 0,
          lineHeight: 1.5,
        }}
      >
        <span style={{ flex: 1 }}>{q}</span>
        <span
          style={{
            flexShrink: 0,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: open ? "var(--teal)" : "var(--sand)",
            color: open ? "white" : "var(--teal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
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
            marginTop: "0.7rem",
            color: "var(--muted-foreground)",
            lineHeight: 1.7,
            fontSize: "0.9rem",
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
    q: "Für welches Alter ist der Kurs geeignet?",
    a: "Der Kurs ist für Eltern von Kindern zwischen 1,5 und 6 Jahren konzipiert – der klassischen Autonomiephase.",
  },
  {
    q: "Wie lange habe ich Zugang?",
    a: "Du erhältst dauerhaften Zugang. Schau die Videos jederzeit und so oft du möchtest – auch wenn dein zweites Kind in die Trotzphase kommt.",
  },
  {
    q: "Muss ich viel Zeit investieren?",
    a: "Nein. Die Videos sind 5–12 Minuten lang. Du kannst den Kurs in deinem eigenen Tempo absolvieren – auch in kleinen Häppchen zwischendurch.",
  },
  {
    q: "Ist der Ansatz zu 'weich'? Ich möchte meinem Kind trotzdem Grenzen setzen.",
    a: "Bindungsorientiert bedeutet nicht grenzenlos. Du lernst, klare und liebevolle Grenzen zu setzen – ohne Schreien, ohne Strafen, ohne Machtkämpfe.",
  },
  {
    q: "Funktioniert das auch bei meinem Kind?",
    a: "Die Strategien basieren auf Entwicklungspsychologie und wurden von Darleen selbst erprobt. Die Grundprinzipien der Autonomiephase gelten für alle Kinder in diesem Alter.",
  },
];

export default function Home() {
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "var(--cream)",
        color: "var(--foreground)",
      }}
    >
      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: navScrolled ? "rgba(255,255,255,0.96)" : "transparent",
          backdropFilter: navScrolled ? "blur(12px)" : "none",
          boxShadow: navScrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
          transition: "all 0.3s ease",
          padding: "0.85rem 0",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "var(--teal)",
            }}
          >
            ⚓ Mama-Hafen
          </span>
          <button
            className="btn-coral"
            onClick={() => scrollTo("warteliste")}
            style={{ padding: "0.5rem 1.1rem", fontSize: "0.85rem" }}
          >
            Jetzt anmelden
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      {/* Desktop: 2-Spalten-Layout. Mobile: Vollbild-Hintergrund mit Overlay */}
      <section className="hero-section">

        {/* Mobile Hero: Vollbild-Bild mit Overlay und Text darüber */}
        <div className="hero-mobile">
          <img
            src={IMG_HERO}
            alt="Mama begleitet Kind liebevoll"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
            }}
          />
          {/* Gradient-Overlay von unten */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.82) 100%)",
          }} />
          {/* Text über dem Bild */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            height: "100%", padding: "1.5rem 1.5rem 2.5rem",
          }}>
            <FadeUp>
              <span style={{
                display: "inline-block", background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)", color: "white",
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", padding: "0.3rem 0.9rem",
                borderRadius: 50, marginBottom: "1rem", border: "1px solid rgba(255,255,255,0.3)",
              }}>
                ⚓ Online-Kurs für Mamas
              </span>
            </FadeUp>
            <FadeUp delay={60}>
              <h1 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.9rem, 8vw, 2.8rem)",
                lineHeight: 1.15, color: "white",
                marginBottom: "0.9rem", textShadow: "0 2px 12px rgba(0,0,0,0.3)",
              }}>
                Ist dein Kind plötzlich ein kleiner{" "}
                <em style={{ color: "#a8e6cf", fontStyle: "italic" }}>Tyrann?</em>
              </h1>
            </FadeUp>
            <FadeUp delay={120}>
              <p style={{
                fontSize: "0.95rem", lineHeight: 1.7,
                color: "rgba(255,255,255,0.88)",
                marginBottom: "1.5rem",
              }}>
                Lerne, die Autonomiephase zu verstehen und endlich wieder{" "}
                <strong style={{ color: "white" }}>Ruhe in euren Familienalltag</strong>{" "}
                zu bringen.
              </p>
            </FadeUp>
            <FadeUp delay={180}>
              <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
                <button className="btn-coral" onClick={() => scrollTo("kurs")} style={{ flex: 1, justifyContent: "center", textAlign: "center" }}>
                  Mehr erfahren ↓
                </button>
                <button onClick={() => scrollTo("warteliste")} style={{
                  flex: 1, background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)", color: "white",
                  border: "1.5px solid rgba(255,255,255,0.5)",
                  borderRadius: 50, padding: "0.85rem 1.2rem",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                  fontSize: "0.95rem", cursor: "pointer", textAlign: "center",
                }}>
                  Auf die Warteliste
                </button>
              </div>
            </FadeUp>
            {/* Badge */}
            <FadeUp delay={240}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 50, padding: "0.45rem 1rem",
                marginTop: "1.2rem", width: "fit-content",
              }}>
                <span style={{ fontSize: "1rem" }}>🎬</span>
                <span style={{ color: "white", fontSize: "0.8rem", fontWeight: 700 }}>11 Lektionen + 5 Bonus-Module</span>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Desktop Hero: 2-Spalten-Layout */}
        <div className="hero-desktop">
          <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.5rem", alignItems: "center" }}>
              {/* Text */}
              <div>
                <FadeUp>
                  <span style={{
                    display: "inline-block", background: "var(--teal)", color: "white",
                    fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", padding: "0.3rem 0.9rem",
                    borderRadius: 50, marginBottom: "1.2rem",
                  }}>
                    ⚓ Online-Kurs für Mamas
                  </span>
                </FadeUp>
                <FadeUp delay={80}>
                  <h1 style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(2.2rem, 4vw, 3.3rem)",
                    lineHeight: 1.15, marginBottom: "1.2rem",
                  }}>
                    Ist dein Kind plötzlich ein kleiner{" "}
                    <em style={{ color: "var(--teal)", fontStyle: "italic" }}>Tyrann?</em>
                  </h1>
                </FadeUp>
                <FadeUp delay={160}>
                  <p style={{
                    fontSize: "1rem", lineHeight: 1.8,
                    color: "var(--muted-foreground)", marginBottom: "1.8rem",
                  }}>
                    Lerne, die Autonomiephase zu verstehen, Wutanfälle liebevoll
                    zu begleiten und endlich wieder{" "}
                    <strong style={{ color: "var(--foreground)" }}>Ruhe in euren Familienalltag</strong>{" "}
                    zu bringen.
                  </p>
                </FadeUp>
                <FadeUp delay={240}>
                  <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                    <button className="btn-coral" onClick={() => scrollTo("kurs")}>Mehr erfahren ↓</button>
                    <button className="btn-teal-outline" onClick={() => scrollTo("warteliste")}>Auf die Warteliste</button>
                  </div>
                </FadeUp>
              </div>
              {/* Bild */}
              <FadeUp delay={180}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    borderRadius: "55% 45% 50% 50% / 48% 52% 48% 52%",
                    overflow: "hidden",
                    boxShadow: "0 20px 55px rgba(0,0,0,0.13)",
                    aspectRatio: "4/5",
                  }}>
                    <img src={IMG_HERO} alt="Mama begleitet Kind liebevoll"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{
                    position: "absolute", bottom: "1.5rem", left: "-1rem",
                    background: "white", borderRadius: 12, padding: "0.7rem 1rem",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
                    display: "flex", alignItems: "center", gap: "0.6rem",
                  }}>
                    <span style={{ fontSize: "1.3rem" }}>🎬</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.82rem" }}>11 Video-Lektionen</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>+ 5 Bonus-Module</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 VERSPRECHEN ── */}
      <section style={{ background: "var(--sand)", padding: "4rem 0" }}>
        <Wave fill="var(--sand)" bg="var(--cream)" flip />
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                }}
              >
                Was du nach dem Kurs anders machst
              </h2>
            </div>
          </FadeUp>
          <div className="promise-grid">
            {[
              {
                icon: "🧘",
                title: "Gelassen bleiben",
                text: "Du verstehst, was hinter Wutanfällen steckt – und reagierst ruhig statt reaktiv.",
              },
              {
                icon: "🤝",
                title: "Grenzen ohne Kampf",
                text: "Du setzt klare Grenzen liebevoll – ohne Schreien, ohne schlechtes Gewissen.",
              },
              {
                icon: "💛",
                title: "Tiefere Verbindung",
                text: "Eine starke Bindung reduziert Trotzanfälle und macht das Mamasein wieder leicht.",
              },
            ].map((p, i) => (
              <FadeUp key={p.title} delay={i * 80}>
                <div
                  className="promise-card"
                  style={{
                    background: "white",
                    borderRadius: 18,
                    padding: "1.6rem",
                    textAlign: "center",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
                    height: "100%",
                  }}
                >
                  <div style={{ fontSize: "2.2rem", marginBottom: "0.8rem" }}>
                    {p.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "1.1rem",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--muted-foreground)",
                      fontSize: "0.9rem",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {p.text}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
        <Wave fill="var(--cream)" bg="var(--sand)" />
      </section>

      {/* ── ÜBER DARLEEN ── */}
      <section style={{ background: "var(--cream)", padding: "4rem 0" }}>
        <div className="container">
          <div className="about-layout">
            {/* Bild */}
            <FadeUp className="about-image-wrap">
              <div
                style={{
                  borderRadius: "42% 58% 48% 52% / 46% 50% 50% 54%",
                  overflow: "hidden",
                  boxShadow: "0 16px 45px rgba(0,0,0,0.1)",
                  aspectRatio: "3/4",
                  maxWidth: 320,
                  margin: "0 auto",
                }}
              >
                <img
                  src={IMG_DARLEEN}
                  alt="Darleen, Kursleiterin"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </FadeUp>
            {/* Text */}
            <div className="about-text">
              <FadeUp>
                <span
                  style={{
                    color: "var(--coral)",
                    fontWeight: 800,
                    fontSize: "0.78rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Deine Kursleiterin
                </span>
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                    marginTop: "0.4rem",
                    marginBottom: "1rem",
                  }}
                >
                  Hallo, ich bin Darleen.
                </h2>
              </FadeUp>
              <FadeUp delay={80}>
                <p
                  style={{
                    lineHeight: 1.8,
                    color: "var(--muted-foreground)",
                    marginBottom: "1.2rem",
                    fontSize: "0.97rem",
                  }}
                >
                  Zweifache Mama – und ich kenne diese Erschöpfung aus eigener
                  Erfahrung. Die Autonomiephase hat mich damals an meine
                  Grenzen gebracht. Ich war ständig laut und erkannte mich
                  selbst kaum noch.
                </p>
              </FadeUp>
              <FadeUp delay={140}>
                <blockquote
                  style={{
                    borderLeft: "4px solid var(--teal)",
                    paddingLeft: "1.2rem",
                    margin: "0 0 1.2rem",
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: "1rem",
                    color: "var(--teal-dark)",
                    lineHeight: 1.6,
                  }}
                >
                  „Mit den richtigen Werkzeugen konnte ich nicht nur meinen
                  Kindern helfen – sondern auch selbst wieder Gelassenheit
                  finden."
                </blockquote>
              </FadeUp>
              <FadeUp delay={200}>
                <p
                  style={{
                    lineHeight: 1.8,
                    color: "var(--muted-foreground)",
                    fontSize: "0.97rem",
                  }}
                >
                  Ich habe mich intensiv mit Entwicklungspsychologie beschäftigt
                  und diesen Kurs entwickelt – damit du nicht so lange suchen
                  musst wie ich.
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── KURSMODULE ── */}
      <section id="kurs" style={{ background: "var(--sand)", padding: "4rem 0" }}>
        <Wave fill="var(--sand)" bg="var(--cream)" flip />
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <span
                style={{
                  color: "var(--coral)",
                  fontWeight: 800,
                  fontSize: "0.78rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Der Kurs
              </span>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                  marginTop: "0.4rem",
                }}
              >
                11 Lektionen. Schritt für Schritt.
              </h2>
              <p
                style={{
                  color: "var(--muted-foreground)",
                  maxWidth: 460,
                  margin: "0.6rem auto 0",
                  lineHeight: 1.7,
                  fontSize: "0.95rem",
                }}
              >
                Jedes Video ist 5–12 Minuten kurz und sofort im Alltag
                anwendbar.
              </p>
            </div>
          </FadeUp>

          {/* Modulliste */}
          <FadeUp delay={80}>
            <div
              style={{
                background: "white",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                maxWidth: 760,
                margin: "0 auto 2rem",
              }}
            >
              {modules.map((m, i) => (
                <div
                  key={m.num}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.9rem",
                    padding: "0.85rem 1.2rem",
                    borderBottom:
                      i < modules.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      background: "var(--teal)",
                      color: "white",
                      borderRadius: 8,
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.75rem",
                    }}
                  >
                    {m.num}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontWeight: 600,
                      fontSize: "0.92rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {m.title}
                  </span>
                  <span
                    style={{
                      background: "var(--sand)",
                      borderRadius: 50,
                      padding: "0.18rem 0.6rem",
                      fontSize: "0.75rem",
                      color: "var(--teal)",
                      fontWeight: 700,
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    ⏱ {m.min} Min.
                  </span>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Bonus */}
          <FadeUp delay={130}>
            <div
              style={{
                background: "linear-gradient(135deg, var(--teal), var(--teal-dark))",
                borderRadius: 18,
                padding: "1.6rem 1.8rem",
                maxWidth: 760,
                margin: "0 auto",
                color: "white",
                display: "flex",
                gap: "1.2rem",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "2rem", flexShrink: 0 }}>🎁</div>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "1rem",
                    marginBottom: "0.3rem",
                  }}
                >
                  5 Bonus-Lektionen inklusive
                </div>
                <div
                  style={{
                    opacity: 0.85,
                    fontSize: "0.87rem",
                    lineHeight: 1.55,
                  }}
                >
                  Erziehungsmodelle · Konsequenzen ohne Drohungen · Warum
                  Strafen nicht helfen
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
        <Wave fill="var(--teal)" bg="var(--sand)" />
      </section>

      {/* ── CTA / WARTELISTE ── */}
      <section
        id="warteliste"
        style={{
          background: "var(--teal)",
          padding: "4rem 0",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: 640 }}>
          <FadeUp>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: "white",
                fontSize: "clamp(1.7rem, 5vw, 2.5rem)",
                lineHeight: 1.25,
                marginBottom: "0.9rem",
              }}
            >
              Werde der sichere Hafen
              <br />
              für dein Kind.
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.82)",
                fontSize: "0.97rem",
                lineHeight: 1.75,
                marginBottom: "2rem",
              }}
            >
              Trag dich jetzt auf die Warteliste ein – du erfährst als Erste,
              wenn der Kurs verfügbar ist.
            </p>
          </FadeUp>
          <FadeUp delay={100}>
            {!waitlistDone ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setWaitlistDone(true);
                }}
              >
                {/* Stacked on mobile, row on desktop */}
                <div className="waitlist-form">
                  <input
                    type="text"
                    placeholder="Dein Vorname"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.9rem 1.2rem",
                      border: "none",
                      borderRadius: 50,
                      fontSize: "0.95rem",
                      fontFamily: "'DM Sans', sans-serif",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Deine E-Mail-Adresse"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.9rem 1.2rem",
                      border: "none",
                      borderRadius: 50,
                      fontSize: "0.95rem",
                      fontFamily: "'DM Sans', sans-serif",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-coral"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    Auf die Warteliste ⚓
                  </button>
                </div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.8rem",
                    marginTop: "0.8rem",
                  }}
                >
                  Kein Spam. Jederzeit abmeldbar.
                </p>
              </form>
            ) : (
              <div
                style={{
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 18,
                  padding: "2rem 1.5rem",
                  maxWidth: 420,
                  margin: "0 auto",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>
                  🎉
                </div>
                <p
                  style={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  Super, {name}! Du stehst auf der Liste.
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "0.9rem",
                  }}
                >
                  Wir melden uns an <strong>{email}</strong>.
                </p>
              </div>
            )}
          </FadeUp>
        </div>
        <Wave fill="var(--sand)" bg="var(--teal)" />
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "var(--sand)", padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                }}
              >
                Häufige Fragen
              </h2>
            </div>
          </FadeUp>
          <FadeUp delay={60}>
            <div
              style={{
                background: "white",
                borderRadius: 20,
                padding: "1.2rem 1.5rem",
                boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
              }}
            >
              {faqs.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </FadeUp>
        </div>
        <Wave fill="var(--teal)" bg="var(--sand)" />
      </section>

      {/* ── FOOTER CTA ── */}
      <section
        style={{
          background: "var(--teal)",
          padding: "3.5rem 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <FadeUp>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: "white",
                fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                marginBottom: "1.4rem",
                lineHeight: 1.3,
              }}
            >
              Dein Kind wartet auf seinen sicheren Hafen.
            </h2>
            <button
              className="btn-coral"
              onClick={() => scrollTo("warteliste")}
              style={{ fontSize: "1rem", padding: "0.9rem 2rem" }}
            >
              Jetzt auf die Warteliste ⚓
            </button>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "var(--teal-dark)",
          padding: "2rem 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <div
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.85)",
              marginBottom: "0.8rem",
            }}
          >
            ⚓ Mama-Hafen
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              flexWrap: "wrap",
              marginBottom: "0.8rem",
            }}
          >
            {[
              ["darvismedia.de", "https://darvismedia.de"],
              ["Impressum", "#"],
              ["Datenschutz", "#"],
              ["Kontakt", "#"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "0.83rem",
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.76rem",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} Mama-Hafen · Ein Kurs von Darleen
          </p>
        </div>
      </footer>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        /* Hero: Mobile = Vollbild-Bild mit Overlay; Desktop = 2-Spalten */
        .hero-section {
          padding-top: 0;
        }
        /* Mobile: Vollbild-Hero sichtbar, Desktop-Hero versteckt */
        .hero-mobile {
          display: block;
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 560px;
          max-height: 820px;
          overflow: hidden;
        }
        .hero-desktop {
          display: none;
        }

        /* Versprechen: Mobile = 1 Spalte, Tablet = 3 Spalten */
        .promise-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        /* Über Darleen: Mobile = gestapelt, Desktop = nebeneinander */
        .about-layout {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
        }
        .about-image-wrap {
          width: 100%;
          max-width: 280px;
        }
        .about-text {
          width: 100%;
        }

        /* Wartelisten-Formular: Mobile = gestapelt, Desktop = Reihe */
        .waitlist-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 480px;
          margin: 0 auto;
        }

        @media (min-width: 480px) {
          .promise-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 768px) {
          /* Desktop: Vollbild-Hero versteckt, 2-Spalten-Hero sichtbar */
          .hero-mobile {
            display: none;
          }
          .hero-desktop {
            display: block;
            padding-top: 5rem;
            min-height: 100svh;
            display: flex;
            align-items: center;
          }
          .about-layout {
            flex-direction: row;
            align-items: center;
            gap: 4rem;
          }
          .about-image-wrap {
            flex: 0 0 260px;
            max-width: 260px;
          }
          .about-text {
            flex: 1;
          }
          .waitlist-form {
            flex-direction: row;
            max-width: 600px;
          }
          .waitlist-form input {
            flex: 1;
            width: auto !important;
          }
          .waitlist-form button {
            width: auto !important;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
}
