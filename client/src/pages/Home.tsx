/**
 * MAMA-HAFEN LANDINGPAGE – Mobile-optimierte Version
 * Design: "Coastal Calm" – DM Serif Display + DM Sans
 * Struktur: Hero → 3 Versprechen → Über Darleen → Kursmodule → CTA → FAQ
 */

import { useEffect, useRef, useState } from "react";
import { trackInitiateCheckout } from "@/lib/metaPixel";
import { pinterestInitiateCheckout, pinterestViewContent, pinterestLead } from "@/lib/pinterestTag";

const IMG_HERO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663061854558/DswbdQTvMfJMPVPLtDLMpo/mama-hafen-hero-8D3s4D7uWWZgi4Fzfbffn2.webp";
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
function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
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
    a: "Der Kurs ist für Mamas von Kindern zwischen 1,5 und 6 Jahren gemacht – also genau für die Zeit, die viele als die anstrengendste Phase überhaupt erleben. Ich habe selbst zwei Kinder durch diese Phase begleitet und weiß, wie unterschiedlich das sein kann.",
  },
  {
    q: "Wann erhalte ich Zugang nach dem Kauf?",
    a: "Sofort! Nach erfolgreicher Zahlung erhältst du direkt Zugang zum Kursbereich – kein Warten, kein Download. Einfach einloggen und loslegen. Ich weiß, wie wenig Zeit Mamas haben.",
  },
  {
    q: "Wie lange habe ich Zugang?",
    a: "Du hast dauerhaften Zugang. Schau die Videos jederzeit und so oft du möchtest – auch wenn dein zweites Kind in die Trotzphase kommt. Der Kurs gehört dir.",
  },
  {
    q: "Muss ich viel Zeit investieren?",
    a: "Nein – und das war mir wirklich wichtig. Ich habe die Videos bewusst kurz gehalten: 5 bis 12 Minuten pro Lektion. Du kannst den Kurs in kleinen Häppchen absolvieren – in der Mittagspause, abends auf der Couch, oder wenn die Kinder schlafen.",
  },
  {
    q: "Ist der Ansatz zu 'weich'? Ich möchte meinem Kind trotzdem Grenzen setzen.",
    a: "Das fragen mich wirklich viele – und ich verstehe es total. Bindungsorientiert bedeutet nicht grenzenlos. Ganz im Gegenteil: Du lernst, klare und liebevolle Grenzen zu setzen – ohne Schreien, ohne Strafen, ohne Machtkampf. Das ist kein Trick, das ist Entwicklungspsychologie.",
  },
  {
    q: "Funktioniert das auch bei meinem Kind?",
    a: "Ich kann dir keine Garantie geben, dass sich alles von heute auf morgen verändert – das wäre unehrlich. Aber die Grundprinzipien der Autonomiephase gelten für alle Kinder in diesem Alter. Und wenn du verstehst, was wirklich in deinem Kind vorgeht, verändert sich auch deine Reaktion darauf. Das habe ich selbst erlebt.",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [navScrolled, setNavScrolled] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // UTM-Parameter aus URL lesen (einmalig beim Laden)
  const utmParams = (() => {
    const p = new URLSearchParams(window.location.search);
    return {
      utmSource: p.get("utm_source") || "",
      utmMedium: p.get("utm_medium") || "",
      utmCampaign: p.get("utm_campaign") || "",
    };
  })();

  const handleKaufen = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setCheckoutError("");
    // Meta Pixel: Checkout gestartet
    trackInitiateCheckout(99);
    // Pinterest: Lead (E-Mail eingegeben) + Checkout gestartet
    pinterestLead();
    pinterestInitiateCheckout(99);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, origin: window.location.origin, ...utmParams }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.open(data.url, "_blank");
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

  // Pinterest: ViewContent feuern wenn Kaufsektion sichtbar wird
  useEffect(() => {
    const kaufSection = document.getElementById("kaufen");
    if (!kaufSection) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          pinterestViewContent(99);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(kaufSection);
    return () => obs.disconnect();
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
        className={navScrolled ? "nav-scrolled" : "nav-top"}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
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
              fontSize: "clamp(0.95rem, 3.5vw, 1.2rem)",
              color: navScrolled ? "var(--teal)" : "var(--nav-logo-color, var(--teal))",
              textShadow: navScrolled ? "none" : "var(--nav-logo-shadow, none)",
              transition: "color 0.3s ease",
              whiteSpace: "nowrap",
            }}
          >
            ⚓ Mama-Hafen
          </span>
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <a
              href="/kurs"
              style={{
                background: navScrolled ? "var(--teal)" : "transparent",
                backdropFilter: "none",
                color: navScrolled ? "white" : "var(--teal)",
                border: navScrolled ? "none" : "1.5px solid var(--teal)",
                borderRadius: 50,
                padding: "clamp(0.3rem, 1.5vw, 0.5rem) clamp(0.6rem, 2.5vw, 1rem)",
                fontSize: "clamp(0.72rem, 2.5vw, 0.82rem)",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.3s",
                whiteSpace: "nowrap",
              }}
            >
              🎦 Zum Kurs
            </a>
            <button
              className="btn-coral"
              onClick={() => scrollTo("kaufen")}
              style={{
                padding: "clamp(0.3rem, 1.5vw, 0.5rem) clamp(0.6rem, 2.5vw, 1rem)",
                fontSize: "clamp(0.72rem, 2.5vw, 0.82rem)",
                whiteSpace: "nowrap",
              }}
            >
              Jetzt kaufen
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      {/* Desktop: 2-Spalten-Layout. Mobile: Vollbild-Hintergrund mit Overlay */}
      <section className="hero-section">

        {/* Mobile Hero: Text oben, Video darunter */}
        <div className="hero-mobile">
          {/* Text-Block */}
          <div style={{
            background: "var(--cream)",
            padding: "5rem 1.5rem 1.5rem",
            marginBottom: "52px",
          }}>
            <FadeUp>
              <span style={{
                    display: "inline-block", background: "var(--teal)",
                    color: "white",
                    fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", padding: "0.3rem 0.9rem",
                    borderRadius: 50, marginBottom: "1rem",
                    textAlign: "center",
                  }}>
                ⚓ Für Mamas von Kindern zwischen 1,5 und 6 Jahren
              </span>
            </FadeUp>
            <FadeUp delay={60}>
              <h1 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.9rem, 8vw, 2.6rem)",
                lineHeight: 1.15, color: "var(--foreground)",
                marginBottom: "0.9rem",
              }}>
                Jeden Tag dasselbe: Diskussionen, Wutanfälle, Schuldgefühle –{" "}
                <em style={{ color: "var(--teal)", fontStyle: "italic" }}>und abends fragst du dich, ob das wirklich alles sein kann.</em>
              </h1>
            </FadeUp>
            <FadeUp delay={120}>
              <p style={{
                fontSize: "0.95rem", lineHeight: 1.7,
                color: "var(--muted-foreground)",
                marginBottom: "1.2rem",
              }}>
                Nein, das muss nicht so sein. Ich zeige dir, wie du die Trotzphase wirklich verstehst und meisterst – und so endlich wieder Leichtigkeit in euren Alltag bringst.
              </p>
            </FadeUp>
            <FadeUp delay={180}>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => scrollTo("kurs")}
                  className="btn-coral"
                  style={{ fontSize: "0.85rem", padding: "0.6rem 1.3rem" }}
                >
                  Mehr erfahren ↓
                </button>
                <button
                  onClick={() => scrollTo("kaufen")}
                  className="btn-teal-outline"
                  style={{ fontSize: "0.85rem", padding: "0.6rem 1.3rem" }}
                >
                  Jetzt kaufen ⛳
                </button>
              </div>
            </FadeUp>
          </div>
          {/* Verlauf von Cream ins Video */}
          <div style={{
            width: "100%",
            height: "60px",
            background: "linear-gradient(to bottom, var(--cream) 0%, transparent 100%)",
            position: "relative",
            zIndex: 2,
            marginBottom: "-60px",
            pointerEvents: "none",
          }} />
          {/* Video-Block darunter */}
          <div style={{
            width: "100%",
            aspectRatio: "4/5",
            background: "#000",
            overflow: "hidden",
            position: "relative",
          }}>
            <iframe
              src="https://iframe.mediadelivery.net/embed/655693/04954a8d-6668-4219-bf6b-7b8b127e882d?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Mama-Hafen Hero Video Mobile"
            />

          </div>
        </div>

        {/* Desktop Hero: 2-Spalten-Layout */}
        <div className="hero-desktop">
          <div className="container" style={{ paddingTop: "0.5rem", paddingBottom: "38px" }}>
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
                    ⚓ Für Mamas von Kindern zwischen 1,5 und 6 Jahren
                  </span>
                </FadeUp>
                <FadeUp delay={80}>
                  <h1 style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(2.2rem, 4vw, 3.3rem)",
                    lineHeight: 1.15, marginBottom: "1.2rem",
                  }}>
                    Jeden Tag dasselbe: Diskussionen, Wutanfälle, Schuldgefühle –{" "}
                    <em style={{ color: "var(--teal)", fontStyle: "italic" }}>und abends fragst du dich, ob das wirklich alles sein kann.</em>
                  </h1>
                </FadeUp>
                <FadeUp delay={160}>
                  <p style={{
                    fontSize: "1rem", lineHeight: 1.8,
                    color: "var(--muted-foreground)", marginBottom: "1.8rem",
                  }}>
                    Nein, das muss nicht so sein. Ich zeige dir, wie du die Trotzphase wirklich verstehst und meisterst – und so endlich wieder Leichtigkeit in euren Alltag bringst.
                  </p>
                </FadeUp>
                <FadeUp delay={240}>
                  <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                    <button className="btn-coral" onClick={() => scrollTo("kurs")}>Mehr erfahren ↓</button>
                    <button className="btn-teal-outline" onClick={() => scrollTo("kaufen")}>Jetzt kaufen ⚓</button>
                  </div>
                </FadeUp>
              </div>
              {/* Hero Video – Desktop */}
              <FadeUp delay={180}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 20px 55px rgba(0,0,0,0.18)",
                    aspectRatio: "4/5",
                    background: "#000",
                  }}>
                    <iframe
                      src="https://iframe.mediadelivery.net/embed/655693/04954a8d-6668-4219-bf6b-7b8b127e882d?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
                      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      title="Mama-Hafen Hero Video"
                    />
                  </div>
                  <div style={{
                    position: "absolute", top: "1.5rem", left: "-1.5rem",
                    background: "white", borderRadius: 12, padding: "0.7rem 1rem 0.5rem",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
                    display: "flex", alignItems: "center", gap: "0.6rem",
                  }}>
                    <span style={{ fontSize: "1.3rem" }}>🎬</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.82rem" }}>11 Video-Lektionen</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>Sofort & dauerhaft</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP: Follower-Social-Proof ── */}
      <section style={{ background: "var(--teal)", padding: "0.85rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(1rem, 4vw, 3rem)",
              flexWrap: "wrap",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <span style={{ fontSize: "1.2rem" }}>🎥</span>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>YouTube</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <span style={{ fontSize: "1.2rem" }}>📸</span>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>Instagram</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <span style={{ fontSize: "1.2rem" }}>🎵</span>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>TikTok</span>
              </div>
              <div style={{
                width: "1px", height: "24px",
                background: "rgba(255,255,255,0.25)",
                flexShrink: 0,
              }} className="trust-divider" />
              <div style={{ textAlign: "center" }}>
                <span style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "white",
                }}>120.000+ Mamas</span>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", marginLeft: "0.4rem" }}>vertrauen Darlees Erziehungstipps</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── SOCIAL PROOF / REVIEWS ── */}
      <section style={{ background: "var(--sand)", padding: "4rem 0" }}>
        <Wave fill="var(--sand)" bg="var(--cream)" flip />
        <div className="container" style={{ maxWidth: 760 }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              <span style={{
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--coral)",
              }}></span>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                marginTop: "0.5rem", marginBottom: "0.5rem",
              }}>Was Mamas nach dem Kurs sagen.</h2>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.92rem", lineHeight: 1.7, maxWidth: 520, margin: "0 auto", fontStyle: "italic" }}>
                Jede Nachricht, die ich bekomme, macht mich so glücklich. Zu wissen, dass ich anderen Mamas helfen kann – genau das ist der Grund, warum ich diesen Kurs gemacht habe.
              </p>
            </div>
          </FadeUp>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
            marginTop: "2rem",
          }}>
            {[
              {
                stars: 5,
                title: "„Mama ist nicht nur die, die alles organisiert und schimpft.“",
                text: "Ich habe mir in den letzten Tagen bewusst mehr Zeit für Spaß, Pausen und Nähe genommen – und habe das Gefühl, dass es schon hilft. Das war mein persönlicher Wendepunkt.",
                author: "Laura B., Mama eines 2-Jährigen",
              },
              {
                stars: 5,
                title: "„Grenzen Setzen – so wertvoll und toll erklärt.“",
                text: "Viele Tipps verfolgen wir bereits. Trotzdem fanden wir das Thema Grenzen Setzen besonders stark. Wir werden es einbauen. Tolle Erklärungen und ein guter Reminder für das, was wir schon tun.",
                author: "Sandra R., Mama von zwei Kindern",
              },
              {
                stars: 5,
                title: "„Seitdem fallen ihr die Entscheidungen leichter.“",
                text: "Mein mittleres Kind habe ich durch zu viele offene Fragen überfordert. Nun grenze ich die Auswahl auf zwei oder drei Möglichkeiten ein. Das hat sich sofort verändert.",
                author: "Julia W., Mama von drei Kindern",
              },
              {
                stars: 5,
                title: '„Die praktischen Beispiele aus dem Kurs konnte ich direkt anwenden!“',
                text: "Ich fand alles gut verständlich. Die Beispiele helfen enorm – man weiß sofort, was gemeint ist, und kann es direkt anwenden.",
                author: "Nina K., Mama eines 3-Jährigen",
              },
              {
                stars: 5,
                title: "„Man hört dir sehr gern zu – es fällt einem leicht zu folgen.“",
                text: "Der Kurs war echt angenehm und hat mich nochmal neu motiviert. Neue Perspektiven, die ich vorher nicht gesehen hatte. Die Videolänge und Anzahl sind super – gut in den Alltag integrierbar!",
                author: "Melanie S., Mama von zwei Kindern",
              },
              {
                stars: 5,
                title: '„Ich würde den Kurs auch Oma und Opa empfehlen!"',
                text: "Ich würde den Kurs auch Oma und Opas als Basiskurs empfehlen. Gerade da haben wir Schwierigkeiten und weniger Akzeptanz für unsere Ansätze Kinder zu erziehen. Gerade das Warum und die kausalen Zusammenhänge fanden wir in dem Kurs toll.",
                author: "Sandra M., Mama eines 2-Jährigen",
              },
              {
                stars: 5,
                title: '„Man hört dir sehr gern zu!"',
                text: "Man hört dir sehr gern zu und es fällt einem leicht dir zu folgen, war echt angenehm und hat mich nochmal neu motiviert und mir wieder ein paar neue Perspektiven gegeben \u2013 vielen lieben Dank dafür!!",
                author: "Laura B., Mama eines 3-Jährigen",
              },
              {
                stars: 5,
                title: '„Tolle Erklärungen und wertvolle neue Blickwinkel!"',
                text: "Hat sehr viel Spaß gemacht. Tolle Erklärungen, tolle Vermittlung von Basiswissen und ein guter Reminder für das, was wir schon tun \u2013 plus noch einige wertvolle neue Hinweise und Blickwinkel auf gerade aktuelle Themen bei uns. Danke dafür.",
                author: "Katharina R., Mama von zwei Kindern",
              },
              {
                stars: 5,
                title: "„Etwas mehr innere Ruhe.“",
                text: "Einige Tipps kannte ich schon – aber durch Darlees Erzählung haben sie mir neu gezeigt, wie man sie wirklich einsetzt. Zwei-drei Ansätze habe ich direkt neu umgesetzt. Für meine Große (6) waren sie besonders wertvoll.",
                author: "Katharina M., Mama einer 6-Jährigen",
              },

            ].map((r, i) => (
              <FadeUp key={r.author} delay={i * 60}>
                <div style={{
                  background: "white",
                  borderRadius: 18,
                  padding: "1.4rem 1.5rem",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: "0.6rem",
                }}>
                  <div style={{ color: "#f59e0b", fontSize: "0.9rem", letterSpacing: "0.05em" }}>
                    {"\u2605".repeat(r.stars)}
                  </div>
                  <div style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "1rem",
                    color: "var(--foreground)",
                    lineHeight: 1.4,
                  }}>{r.title}</div>
                  <p style={{
                    fontSize: "0.88rem",
                    color: "var(--muted-foreground)",
                    lineHeight: 1.65,
                    margin: 0,
                    flex: 1,
                  }}>{r.text}</p>
                  <div style={{
                    fontSize: "0.78rem",
                    color: "var(--teal)",
                    fontWeight: 700,
                    marginTop: "auto",
                    paddingTop: "0.5rem",
                    borderTop: "1px solid var(--border)",
                  }}>&#8212; {r.author}</div>
                </div>
              </FadeUp>
            ))}
          </div>

        </div>
        <Wave fill="var(--cream)" bg="var(--sand)" />
      </section>

      {/* ── STORY-SEKTION: Darlees Geschichte (aus Video-Skript) ── */}
      <section style={{ background: "var(--cream)", padding: "5rem 0 4.5rem", position: "relative", overflow: "hidden" }}>
        {/* Dezenter Hintergrund-Akzent */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "40%", height: "100%",
          background: "radial-gradient(ellipse at 80% 20%, rgba(74,163,148,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ maxWidth: 740, position: "relative" }}>

          {/* Autorin-Badge – aufgewertet */}
          <FadeUp>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.9rem",
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 50,
              padding: "0.45rem 1.1rem 0.45rem 0.45rem",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              marginBottom: "2.2rem",
            }}>
              <img
                src={IMG_DARLEEN}
                alt="Darleen"
                style={{
                  width: 44, height: 44,
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--foreground)", lineHeight: 1.3 }}>Darleen</div>
                <div style={{ fontSize: "0.76rem", color: "var(--muted-foreground)" }}>Mama von zwei Kindern · Gründerin Mama-Hafen</div>
                <div style={{ fontSize: "0.72rem", color: "var(--teal)", fontWeight: 700, marginTop: "0.15rem" }}>🎥📸🎵 120.000+ Follower</div>
              </div>
            </div>
          </FadeUp>

          {/* Einstieg: Leser abholen – größer & fetter */}
          <FadeUp delay={60}>
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.25rem, 3.2vw, 1.6rem)",
              lineHeight: 1.55,
              color: "var(--foreground)",
              marginBottom: "2rem",
            }}>
              Du bist nicht allein. Ich kenne diese Momente, in denen man alles versucht und trotzdem scheitert.
            </p>
          </FadeUp>

          <FadeUp delay={100}>
            <p style={{
              fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
              lineHeight: 1.85,
              color: "var(--muted-foreground)",
              marginBottom: "1.5rem",
            }}>
              Schon seit ich klein war, wollte ich unbedingt Mama werden und am besten "alles besser machen", was mich damals bei meinen eigenen Eltern gestört hat.
              Ich habe mich also schon sehr früh mit dem Thema Erziehung beschäftigt und viel gelesen und gelernt.
              Als ich dann schwanger wurde, fühlte ich mich wahnsinnig gut vorbereitet...und wurde dann eiskalt von der "Trotzphase" erwischt.
              Ich wurde plötzlich zu einem Menschen, den ich kaum noch wiedererkannt habe. Ich bin ständig laut geworden, habe mich mit meinen „sturen Kindern" herumgestritten. Und danach habe ich mich selbst fertiggemacht – weil ich dachte, dass ich als Mutter komplett versagt habe.
              Ich wollte unbedingt Mama werden und nun fühlte sich alles an wie ein Kampf. Und ich sehnte mich so sehr nach dieser Freude und Entspanntheit mit meinen Kindern, die ich mir immer gewünscht hatte.
            </p>
          </FadeUp>

          {/* Schmerz-Box – hebt den emotionalen Tiefpunkt hervor */}
          <FadeUp delay={130}>
            <div style={{
              background: "rgba(196,168,130,0.12)",
              border: "1px solid rgba(196,168,130,0.35)",
              borderRadius: 16,
              padding: "1.4rem 1.6rem",
              marginBottom: "1.8rem",
            }}>
              <p style={{
                fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                lineHeight: 1.85,
                color: "var(--muted-foreground)",
                margin: 0,
              }}>
                Ich erinnere mich noch genau daran, wie frustriert und ausgelaugt ich mich früher gefühlt habe. Der Tag begann morgens direkt mit Stress und Konflikten, die scheinbar aus dem Nichts kamen. Ständig gab es Diskussionen oder einfach nur ein bockiges „Nein" – egal ob beim Anziehen, Zähneputzen, beim Essen oder auf dem Spielplatz. Meine Kinder waren einfach ständig unzufrieden. Und ich saß abends, wenn die Kinder endlich eingeschlafen waren, oft einfach nur völlig erschöpft auf der Couch und fragte mich, warum das Mamaleben so anstrengend sein muss.
              </p>
            </div>
          </FadeUp>

          {/* Wendepunkt – Teal-Akzent */}
          <FadeUp delay={180}>
            <div style={{
              background: "rgba(74,163,148,0.07)",
              borderLeft: "4px solid var(--teal)",
              borderRadius: "0 14px 14px 0",
              padding: "1.3rem 1.5rem",
              margin: "2rem 0",
            }}>
              <p style={{
                fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                lineHeight: 1.85,
                color: "var(--muted-foreground)",
                margin: 0,
              }}>
                Irgendwann habe ich angefangen, wirklich zu verstehen, <strong style={{ color: "var(--foreground)" }}>was in meinen Kindern vorgeht</strong> und dass fast alles, was ich über die Trotzphase geglaubt hatte, Schwachsinn ist. Plötzlich habe ich auch meine eigene Kindheit mit ganz anderen Augen gesehen. Und ich habe verstanden, warum mich so manches Verhalten meiner Kinder so extrem triggert.
                <br /><br />
                Ich habe verstanden wie wichtig die Autonomiephase ist und dass es eben nicht darum geht, ihnen den Trotz und die Widerspenstigkeit "auszutreiben" (wie man es früher gern gesagt hat), sondern um einen wichtigen Entwicklungsschritt.
              </p>
            </div>
          </FadeUp>

          {/* Transformation */}
          <FadeUp delay={220}>
            <p style={{
              fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
              lineHeight: 1.85,
              color: "var(--muted-foreground)",
              marginBottom: "1.5rem",
            }}>
              Heute sieht unser Familienalltag komplett anders aus. Morgens starten wir ruhig und entspannt in den Tag. Es gibt endlich keine ständigen Diskussionen mehr! Die Kinder kooperieren viel besser, und ich habe das Gefühl, dass wir zusammenarbeiten statt gegeneinander. Auch die Wutanfälle sind so viel seltener geworden – und wenn sie doch mal passieren, verlaufen sie viel schneller und ruhiger, weil ich weiß, wie ich reagieren muss.
            </p>
          </FadeUp>

          <FadeUp delay={260}>
            <p style={{
              fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
              lineHeight: 1.85,
              color: "var(--muted-foreground)",
              marginBottom: "1.5rem",
            }}>
              Ich fühle mich endlich nicht mehr wie eine erschöpfte Managerin, die nur noch versucht, den Tag irgendwie zu überstehen. Stattdessen habe ich das Gefühl, wirklich für meine Kinder da zu sein – ohne mich selbst aufgeben zu müssen. Ich kann das Mamasein und die Kindheit meiner Söhne endlich genießen. Und ich wünsche wirklich jeder Mama, dass sie das auch erleben kann!
            </p>
          </FadeUp>

          {/* Abschluss – Conversion-Box */}
          <FadeUp delay={300}>
            <div style={{
              background: "white",
              border: "1.5px solid var(--border)",
              borderRadius: 18,
              padding: "1.8rem 2rem",
              boxShadow: "0 6px 28px rgba(0,0,0,0.07)",
              marginTop: "0.5rem",
            }}>
              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
                lineHeight: 1.55,
                color: "var(--foreground)",
                marginBottom: "0.8rem",
              }}>
                Genau deshalb habe ich diesen Kurs entwickelt.
              </p>
              <p style={{
                fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                lineHeight: 1.85,
                color: "var(--muted-foreground)",
                marginBottom: "1.4rem",
              }}>
                Damit du sowohl aus entwicklungspsychologischer Sicht verstehst, was in deinem Kind gerade vorgeht. Als auch praktische Strategien an die Hand bekommst, die wirklich funktionieren.
                <br /><br />
                Wir schauen uns gemeinsam die Grundlagen aus der Kinderforschung an und gehen aber auch in die Praxis! Ich habe die besten Tipps und Strategien, die uns als Familie geholfen haben, für dich zusammengestellt und mein Workbook kannst du als kleine Übersicht der Themen benutzen und dabei Lektion für Lektion deinen eigenen Familienalltag reflektieren und das Gelernte direkt übertragen und anwenden!
              </p>
              <div style={{ textAlign: "center" }}>
                <button
                  className="btn-coral"
                  onClick={() => document.getElementById("kaufen")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ padding: "0.55rem 1.6rem", fontSize: "0.9rem", borderRadius: 50 }}
                >
                  Jetzt Kurs sichern →
                </button>
                <p style={{ marginTop: "0.6rem", fontSize: "0.76rem", color: "var(--muted-foreground)" }}>
                  🛡️ 7-Tage-Geld-zurück-Garantie · Kein Risiko
                </p>
              </div>
            </div>
          </FadeUp>

        </div>
      </section>

      {/* ── 3 VERSPRECHEN ── */}
      <section style={{ background: "var(--sand)", padding: "2.5rem 0 3rem" }}>
        <Wave fill="var(--sand)" bg="var(--cream)" flip />
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.4rem, 4vw, 2rem)",
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
                title: "Ruhig bleiben – auch wenn es eskaliert",
                text: "Beim nächsten Wutanfall im Supermarkt weißt du genau, was zu tun ist, anstatt selbst laut zu werden oder dich hilflos zu fühlen.",
              },
              {
                icon: "🤝",
                title: "Grenzen setzen – ohne Machtkampf",
                text: "Du sagst Nein – und dein Kind akzeptiert es. Ohne Schreien, ohne schlechtes Gewissen, ohne stundenlange Diskussionen.",
              },
              {
                icon: "💛",
                title: "Wieder Mama sein – nicht Krisenmanagerin",
                text: "Wenn du verstehst, warum dein Kind so reagiert, hört die Erschöpfung auf. Du genießt wieder gemeinsame Momente – statt sie nur zu überstehen.",
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
                  <div className="promise-icon" style={{ fontSize: "2.2rem", marginBottom: "0.8rem" }}>
                    {p.icon}
                  </div>
                  <div className="promise-body">
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
                className="darleen-frame"
                style={{
                  borderRadius: "42% 58% 48% 52% / 46% 50% 50% 54%",
                  overflow: "hidden",
                  boxShadow: "0 16px 45px rgba(0,0,0,0.1)",
                  width: 359,
                  height: 462,
                  maxWidth: 359,
                  paddingRight: "35px",
                  paddingLeft: "1px",
                  margin: "0 auto 0 -4rem",
                }}
              >
                <img
                  src={IMG_DARLEEN}
                  alt="Darleen, Kursleiterin"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    transform: "scale(1.45)",
                    transformOrigin: "center top",
                    paddingRight: "11px",
                    paddingBottom: "55px",
                    paddingLeft: "22px",
                  }}
                />
              </div>
            </FadeUp>
            {/* Text */}
            <div className="about-text">
              <FadeUp>

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
                  Ich bin Mama von zwei Kindern – und ich habe genau das durchgemacht, wo du gerade vielleicht mitten drin bist. Mein erstes Kind hat mich während seiner Autonomiephase absolut an meine Grenzen gebracht. Ich war täglich am Ende, habe Dinge gesagt, die ich bereut habe, und hatte Angst, dass ich als Mama versage. Meine Kinder haben darunter gelitten – und ich natürlich auch.
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
                  Mein erster Schritt war es, zu verstehen wie sich das Gehirn von Kindern entwickelt.
                  Doch Theorie allein genügt nicht, deshalb habe ich viele Expertentipps selbst ausprobiert und die besten für euch zusammengetragen!
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
                  Seitdem ist es meine persönliche Mission, diese Erkenntnis weiterzugeben – damit du nicht selbst all die Ratgeber, Forschungserkenntnisse und Tipps durchforsten musst.
                  Damit du schon morgen wieder die Mama sein kannst, die du sein möchtest und mit Zufriedenheit und nicht mit Bedauern und Enttäuschung auf die ersten Jahre deiner Kinder zurückblicken kannst!
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA nach Darleen-Story ── */}
      <section style={{ background: "var(--cream)", padding: "2rem 0 0", textAlign: "center" }}>
        <FadeUp>
          <div className="container" style={{ maxWidth: 600 }}>
            <p style={{
              fontSize: "1rem",
              color: "var(--muted-foreground)",
              lineHeight: 1.75,
              marginBottom: "1.5rem",
            }}>
              Bereit, die Trotzphase endlich zu verstehen – und wieder die Mama zu sein, die du sein möchtest?
            </p>
            <button
              className="btn-coral"
              onClick={() => document.getElementById("kaufen")?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontSize: "0.95rem", padding: "0.75rem 2rem" }}
            >
              Jetzt Kurs kaufen ⚓
            </button>
          </div>
        </FadeUp>
      </section>

      {/* ── COMMUNITY USP SECTION ── */}
      <section style={{ background: "var(--cream)", padding: "2rem 0 2.5rem" }}>
        <div className="container">
          <FadeUp>
            <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", paddingTop: "3.5rem" }}>
              {/* "Jetzt Neu" Sticker oben links – ragt über das grüne Feld heraus */}
              <div style={{
                position: "absolute",
                top: 0,
                left: "1.2rem",
                marginLeft: "-51px",
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "var(--coral)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column" as const,
                transform: "rotate(-12deg)",
                zIndex: 10,
              }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "white", letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.2, textAlign: "center", display: "block" }}>Jetzt</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "white", letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.2, textAlign: "center", display: "block" }}>Neu</span>
              </div>
            <div style={{
              background: "linear-gradient(135deg, var(--teal) 0%, #1a5c52 100%)",
              borderRadius: 20,
              padding: "1.6rem 1.4rem",
              boxShadow: "0 16px 56px rgba(42,124,111,0.28)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Decorative anchor watermark */}
              <div style={{
                position: "absolute",
                right: "-1.5rem",
                bottom: "-2rem",
                fontSize: "9rem",
                opacity: 0.06,
                lineHeight: 1,
                userSelect: "none",
                pointerEvents: "none",
              }}>⚓</div>





              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
                color: "#ffffff",
                lineHeight: 1.25,
                marginBottom: "0.9rem",
                marginTop: "1rem",
                paddingLeft: "84px",
                paddingRight: "10px",
              }}>
                Was diesen Kurs noch besonders macht?
              </h2>

              <p style={{
                fontSize: "0.88rem",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.7,
                marginBottom: "1rem",
              }}>
                Lasst uns von einander lernen und weg von der Theorie und hin zur Praxis gehen! Woche für Woche wird dieser Kurs mit echten Alltagsbeispielen erweitert.
              </p>

              <div style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: "0.75rem",
              }}>
                {[
                  { icon: "📓", text: "Workbook mit Reflexionsfragen und praktischen Impulsen, die du sofort umsetzen kannst" },
                  { icon: "🔄", text: "Woche für Woche neue Videos – mit Beispielen aus eurem Alltag" },
                  { icon: "💬", text: "Brauchst du Hilfe bei der Umsetzung? Schick mir deine Fragen zu konkreten Alltagssituationen" },
                ].map((item) => (
                  <div key={item.text} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.8rem",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: "0.85rem 1rem",
                    backdropFilter: "blur(4px)",
                  }}>
                    <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "0.05rem" }}>{item.icon}</span>
                    <span style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.92)", lineHeight: 1.55 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── KURSMODULE ── */}
      <section id="kurs" style={{ background: "var(--sand)", padding: "2.5rem 0 3rem" }}>
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
                maxWidth: 480,
                margin: "0 auto 2rem",
              }}
            >
              {modules.map((m, i) => (
                <div
                  key={m.num}
                  className="module-row"
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
                    className="module-num"
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
                    className="module-title"
                    style={{
                      flex: 1,
                      fontWeight: 600,
                      fontSize: "0.92rem",
                      lineHeight: 1.4,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {m.title}
                  </span>

                </div>
              ))}
            </div>
          </FadeUp>

          {/* USP Highlight: Workbook + Wöchentliche Community-Videos */}
          <FadeUp delay={110}>
            <div
              style={{
                background: "linear-gradient(135deg, var(--teal) 0%, #1a5c52 100%)",
                borderRadius: 20,
                padding: "1.8rem 2rem",
                maxWidth: 480,
                margin: "0 auto 2rem",
                boxShadow: "0 8px 32px rgba(42,124,111,0.25)",
              }}
            >
              <div style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
                marginBottom: "0.5rem",
              }}>Inklusive im Kurs</div>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.25rem",
                color: "#ffffff",
                fontWeight: 700,
                lineHeight: 1.3,
                marginBottom: "0.9rem",
              }}>📓 Workbook + Woche für Woche neue Praxisvideos</div>
              <p style={{
                fontSize: "0.88rem",
                color: "rgba(255,255,255,0.88)",
                lineHeight: 1.7,
                margin: 0,
              }}>
                Zusätzlich zu den 11 Lektionen veröffentliche ich regelmäßig neue Videos, in denen ich echte Erziehungsfragen und Praxisbeispiele aus der Community bespreche. Der Kurs wächst mit dir. Woche für Woche.
              </p>
            </div>
          </FadeUp>

          {/* Kauf-CTA nach Modulliste */}
          <FadeUp delay={130}>
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <button
                className="btn-coral"
                onClick={() => scrollTo("kaufen")}
                style={{ fontSize: "0.88rem", padding: "0.65rem 1.5rem" }}
              >
                Jetzt Kurs kaufen ⚓
              </button>
            </div>
          </FadeUp>
        </div>
        <Wave fill="var(--teal)" bg="var(--sand)" />
      </section>

      {/* ── KAUF-SEKTION ── */}
      <section
        id="kaufen"
        style={{
          position: "relative",
          background: "var(--cream)",
          padding: "5rem 0 0",
          overflow: "hidden",
        }}
      >
        {/* Dekorativer Hintergrund-Kreis */}
        <div style={{
          position: "absolute", top: "-120px", right: "-120px",
          width: 420, height: 420,
          borderRadius: "50%",
          background: "var(--teal)",
          opacity: 0.06,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "60px", left: "-80px",
          width: 280, height: 280,
          borderRadius: "50%",
          background: "var(--coral)",
          opacity: 0.05,
          pointerEvents: "none",
        }} />

        <div className="container" style={{ maxWidth: 720 }}>
          {/* Headline-Block */}
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span style={{
                display: "inline-block",
                background: "var(--coral)",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.35rem 1rem",
                borderRadius: 50,
                marginBottom: "1.2rem",
              }}>
                ✅ Sofortiger Zugang nach Kauf
              </span>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.9rem, 5vw, 2.8rem)",
                lineHeight: 1.2,
                color: "var(--foreground)",
                marginBottom: "1rem",
              }}>
                Ich hätte mir so einen Kurs gewünscht,{" "}
                <em style={{ color: "var(--teal)", fontStyle: "italic" }}>als ich mitten in der Trotzphase steckte.</em>
              </h2>
              <p style={{
                color: "var(--muted-foreground)",
                fontSize: "1rem",
                lineHeight: 1.75,
                maxWidth: 520,
                margin: "0 auto",
              }}>
                Kurz, ehrlich und direkt mit echten Situationen aus dem Familienalltag. Hier nun als einmaliger Kauf mit dauerhaftem Zugang. Schau die Videos jederzeit und so oft du möchtest.
              </p>
            </div>
          </FadeUp>

          {/* Kauf-Karte */}
          <FadeUp delay={100}>
              <div className="waitlist-card" style={{
                background: "white",
                borderRadius: 24,
                padding: "2rem 1.75rem",
                boxShadow: "0 8px 40px rgba(0,0,0,0.09)",
                border: "1px solid var(--border)",
                maxWidth: 560,
                margin: "0 auto",
              }}>
                {/* Preis-Bereich */}
                <div style={{
                  textAlign: "center",
                  marginBottom: "1.5rem",
                  paddingBottom: "1.5rem",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <div style={{ marginBottom: "0.4rem" }}>
                    <span style={{
                      display: "inline-block",
                      background: "var(--coral)",
                      color: "white",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "0.25rem 0.75rem",
                      borderRadius: 50,
                      marginBottom: "0.6rem",
                    }}>Einführungspreis</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                    <span style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "clamp(2.4rem, 8vw, 3.2rem)",
                      fontWeight: 700,
                      color: "var(--teal)",
                      lineHeight: 1,
                    }}>99 €</span>
                    <span style={{
                      fontSize: "1.2rem",
                      color: "var(--muted-foreground)",
                      textDecoration: "line-through",
                      opacity: 0.7,
                    }}>149 €</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                    Einmalzahlung · Dauerhafter Zugang · Sofort verfügbar
                  </div>
                </div>

                {/* Was ist enthalten */}
                <div style={{ marginBottom: "1.5rem" }}>
                  {[
                    { icon: "🎬", text: "11 Video-Lektionen (je 5–12 Min.)" },
                    { icon: "📓", text: "Workbook mit Reflexionsfragen zu jeder Lektion" },
                    { icon: "🔄", text: "Woche für Woche neue Praxisvideos aus der Community" },
                    { icon: "♾️", text: "Dauerhafter Zugang – auch fürs zweite Kind" },
                    { icon: "📱", text: "Optimiert für Handy – lerne zwischendurch" },
                  ].map((item) => (
                    <div key={item.text} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.7rem",
                      padding: "0.45rem 0",
                      fontSize: "0.92rem",
                      color: "var(--foreground)",
                    }}>
                      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleKaufen}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    <div style={{ position: "relative" }}>
                      <span style={{
                        position: "absolute", left: "1rem", top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "1rem", pointerEvents: "none",
                      }}>📧</span>
                      <input
                        type="email"
                        placeholder="Deine E-Mail-Adresse"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="waitlist-input"
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem 0.75rem 2.5rem",
                          border: "1.5px solid var(--border)",
                          borderRadius: 12,
                          fontSize: "0.93rem",
                          fontFamily: "'DM Sans', sans-serif",
                          outline: "none",
                          background: "var(--cream)",
                          color: "var(--foreground)",
                          boxSizing: "border-box" as const,
                          transition: "border-color 0.2s",
                        }}
                        onFocus={e => (e.target.style.borderColor = "var(--teal)")}
                        onBlur={e => (e.target.style.borderColor = "var(--border)")}
                      />
                      <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", marginTop: "0.35rem", marginBottom: 0 }}>
                        🔑 Nach dem Klick wirst du zu Stripe weitergeleitet – dort gibst du deine Zahlungsdaten ein.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={checkoutLoading}
                      className="waitlist-btn"
                      style={{
                        width: "100%",
                        background: checkoutLoading ? "#aaa" : "var(--coral)",
                        color: "white",
                        border: "none",
                        borderRadius: 12,
                        padding: "0.8rem",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 800,
                        fontSize: "0.95rem",
                        cursor: checkoutLoading ? "not-allowed" : "pointer",
                        letterSpacing: "0.02em",
                        transition: "background 0.2s, transform 0.15s",
                      }}
                      onMouseEnter={e => {
                        if (!checkoutLoading) {
                          (e.currentTarget as HTMLButtonElement).style.background = "#c0392b";
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
                      <p style={{ color: "#c0392b", fontSize: "0.85rem", textAlign: "center", marginTop: "0.5rem" }}>
                        {checkoutError}
                      </p>
                    )}
                    {/* Sicherheits-Hinweis */}
                    <p style={{
                      textAlign: "center",
                      fontSize: "0.78rem",
                      color: "var(--muted-foreground)",
                      marginTop: "0.2rem",
                    }}>
                      🎥📸🎵 120.000+ Mamas in der Community · 🔒 Sichere Zahlung über Stripe
                    </p>

                    {/* 7-Tage-Garantie */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.9rem",
                      background: "rgba(74,163,148,0.08)",
                      border: "1.5px solid rgba(74,163,148,0.3)",
                      borderRadius: 14,
                      padding: "0.9rem 1.1rem",
                      marginTop: "0.4rem",
                    }}>
                      <span style={{ fontSize: "2rem", flexShrink: 0 }}>🛡️</span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--teal)", marginBottom: "0.2rem" }}>
                          7-Tage-Geld-zurück-Garantie
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                          Nicht überzeugt? Schreib uns einfach eine Mail – wir erstatten dir umgehend den vollen Betrag.
                        </div>
                      </div>
                    </div>
                  </div>
                </form>


              </div>
          </FadeUp>
        </div>

        {/* Wellen-Übergang nach unten */}
        <div style={{ marginTop: "4rem" }}>
          <Wave fill="var(--sand)" bg="var(--cream)" />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "var(--sand)", padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <span style={{
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--coral)",
                display: "block", marginBottom: "0.5rem",
              }}>Das fragen mich wirklich viele!</span>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                }}
              >
                Deine Fragen – meine ehrlichen Antworten.
              </h2>
            </div>
          </FadeUp>
          <FadeUp delay={60}>
            <div
              className="faq-card"
              style={{
                background: "white",
                borderRadius: 20,
                padding: "1.2rem 1.5rem",
                boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
              }}
            >
              {faqs.map((f, i) => (
                <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
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
          padding: "4rem 0",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: 640 }}>
          <FadeUp>
            <p style={{
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "0.8rem",
            }}>Von Mama zu Mama</p>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: "white",
                fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                marginBottom: "1.2rem",
                lineHeight: 1.3,
              }}
            >
              Ich fühle mich endlich nicht mehr wie eine erschöpfte Managerin, die nur noch versucht, den Tag irgendwie zu überstehen.
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "1rem",
              lineHeight: 1.75,
              marginBottom: "2rem",
            }}>
              Stattdessen habe ich das Gefühl, wirklich für meine Kinder da zu sein – ohne mich selbst aufgeben zu müssen.
              Ich kann das Mamasein und die Kindheit meiner Söhne endlich genießen.
              <br/><br/>
              <strong style={{ color: "white" }}>Das wünsche ich auch dir.</strong>
            </p>
            <button
              className="btn-coral"
              onClick={() => scrollTo("kaufen")}
              style={{ fontSize: "0.95rem", padding: "0.8rem 2rem" }}
            >
              Jetzt Kurs kaufen ⚓
            </button>
            <p style={{
              marginTop: "1rem",
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}>
              🛡️ <strong style={{ color: "white" }}>7-Tage-Geld-zurück-Garantie</strong> · Ohne Fragen, ohne Bitte um Erklärung.
            </p>
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
              ["Impressum", "https://www.darvismedia.de/impressum"],
              ["Datenschutz", "https://www.darvismedia.de/datenschutz"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "0.83rem",
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
            <a
              href="mailto:info@darvismedia.de"
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.83rem",
                textDecoration: "none",
              }}
            >
              Kontakt
            </a>
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.76rem",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} Mama-Hafen · Ein Kurs von Mamaleen
          </p>
        </div>
      </footer>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        /* ── BASE (Mobile-First) ── */
        .hero-section { padding-top: 0; }

        /* Nav: Mobile = Verlauf von dunkel nach transparent */
        .nav-top {
          background: linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.0) 100%);
          backdrop-filter: none;
          box-shadow: none;
          padding-bottom: 1.8rem;
          --nav-logo-color: white;
          --nav-logo-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .nav-scrolled {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(12px);
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          padding-bottom: 0.85rem;
          --nav-logo-color: var(--teal);
          --nav-logo-shadow: none;
        }

        /* Mobile Hero: Text oben + Video unten */
        .hero-mobile {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .hero-desktop { display: none; }

        /* Versprechen: 1 Spalte auf Mobile */
        .promise-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.85rem;
        }
        .promise-card {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 0.75rem;
          text-align: left !important;
          padding: 0.85rem 1rem !important;
        }
        .promise-card .promise-icon {
          font-size: 1.6rem;
          flex-shrink: 0;
          margin-bottom: 0;
        }
        .promise-card .promise-body { flex: 1; }
        .promise-card h3 { font-size: 0.97rem; margin-bottom: 0.25rem; }
        .promise-card p { font-size: 0.85rem; line-height: 1.55; margin: 0; }

        /* Über Darleen: gestapelt auf Mobile */
        .about-layout {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }
        .about-image-wrap {
          width: 100%;
          max-width: 160px;
          margin: 0 auto;
        }
        .darleen-frame {
          width: 160px !important;
          height: 206px !important;
          max-width: 160px !important;
          margin: 0 auto !important;
          padding-right: 16px !important;
          padding-left: 0px !important;
        }
        .about-text { width: 100%; }

        /* Kursmodule: kompakter auf Mobile */
        .module-row {
          padding: 0.7rem 0.9rem !important;
          gap: 0.65rem !important;
        }
        .module-num {
          width: 28px !important;
          height: 28px !important;
          font-size: 0.7rem !important;
          border-radius: 6px !important;
        }
        .module-title { font-size: 0.84rem !important; }
        .module-time {
          font-size: 0.7rem !important;
          padding: 0.12rem 0.45rem !important;
        }

        /* Kauf-Karte: volle Breite, weniger Padding auf Mobile */
        .waitlist-card {
          padding: 1.6rem 1.2rem !important;
          border-radius: 18px !important;
        }
        .waitlist-trust {
          gap: 0.8rem !important;
          font-size: 0.75rem !important;
          margin-bottom: 1.2rem !important;
          padding-bottom: 1rem !important;
        }
        .waitlist-input {
          padding: 0.8rem 0.9rem 0.8rem 2.4rem !important;
          font-size: 0.9rem !important;
          border-radius: 10px !important;
        }
        .waitlist-btn {
          padding: 0.85rem !important;
          font-size: 0.92rem !important;
          border-radius: 10px !important;
        }

        /* FAQ: kompakter auf Mobile */
        .faq-card {
          padding: 0.8rem 1rem !important;
          border-radius: 16px !important;
        }

        /* ── TABLET (≥ 640px) ── */
        @media (min-width: 640px) {
          .promise-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .promise-card {
            flex-direction: column;
            align-items: center;
            text-align: center !important;
            padding: 1.2rem 1rem !important;
          }
          .promise-card .promise-icon { font-size: 2rem; }
          .promise-card h3 { font-size: 1rem; margin-bottom: 0.4rem; }
          .promise-card p { font-size: 0.88rem; line-height: 1.6; }
        }

        /* ── DESKTOP (≥ 768px) ── */
        @media (min-width: 768px) {
          /* Auf Desktop: kein Verlauf, da heller Cream-Hintergrund */
          .nav-top {
            background: transparent;
            backdrop-filter: none;
            box-shadow: none;
            padding-bottom: 0.85rem;
            --nav-logo-color: var(--teal);
            --nav-logo-shadow: none;
          }
          .hero-mobile { display: none; }
          .hero-desktop {
            display: flex;
            align-items: center;
            padding-top: 4rem;
            min-height: auto;
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
          .about-text { flex: 1; }
          .module-row { padding: 0.85rem 1.2rem !important; gap: 0.9rem !important; }
          .module-num { width: 32px !important; height: 32px !important; font-size: 0.75rem !important; }
          .module-title { font-size: 0.92rem !important; }
          .module-time { font-size: 0.75rem !important; }
          .waitlist-card { padding: 2rem 1.75rem !important; border-radius: 24px !important; }
          .waitlist-trust { gap: 1.5rem !important; font-size: 0.82rem !important; }
          .waitlist-input { padding: 0.75rem 1rem 0.75rem 2.5rem !important; font-size: 0.93rem !important; border-radius: 12px !important; }
          .waitlist-btn { padding: 0.8rem !important; font-size: 0.95rem !important; border-radius: 12px !important; }
          .faq-card { padding: 1.2rem 1.5rem !important; border-radius: 20px !important; }
        }
      `}</style>
    </div>
  );
}
