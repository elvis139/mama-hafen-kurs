/**
 * MAMA-HAFEN LANDINGPAGE
 * Design: "Coastal Calm" – Playfair Display + Nunito
 * Palette: Teal (#2d7d7d) | Sand | Coral | Cream
 * Sales Funnel: AIDA – Attention → Interest → Desire → Action
 */

import { useEffect, useRef, useState } from "react";

// ── Image URLs ──────────────────────────────────────────────────────────────
const IMG_HERO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663061854558/DswbdQTvMfJMPVPLtDLMpo/mama-hafen-hero-8D3s4D7uWWZgi4Fzfbffn2.webp";
const IMG_DARLEEN =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663061854558/DswbdQTvMfJMPVPLtDLMpo/mama-hafen-darleen-3tkZX2UvXKzMYVRCKEJYfg.webp";

// ── Scroll-animation hook ────────────────────────────────────────────────────
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Reusable FadeUp wrapper ──────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`fade-up ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Wave SVG Divider ─────────────────────────────────────────────────────────
function WaveDivider({ fill, bg = "transparent", flip = false }: { fill: string; bg?: string; flip?: boolean }) {
  return (
    <div style={{ background: bg, lineHeight: 0, overflow: "hidden" }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 60, transform: flip ? "scaleY(-1)" : "none" }}>
        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill={fill} />
      </svg>
    </div>
  );
}

// ── Module data ──────────────────────────────────────────────────────────────
const modules = [
  { num: "01", title: "Begrüßung & Überblick", desc: "Warum du mit diesem Kurs genau richtig bist und was dich auf dieser Reise erwartet.", min: 5 },
  { num: "02", title: "Ist mein Kind ein kleiner Tyrann?", desc: "Warum Trotzanfälle ein wichtiger Entwicklungsschritt sind – und wie du entspannt damit umgehst.", min: 8 },
  { num: "03", title: "Die Autonomiephase verstehen", desc: "Einblicke in die Entwicklungspsychologie, die dir helfen, dein Kind wirklich zu verstehen.", min: 9 },
  { num: "04", title: "Die Illusion der Wahl", desc: "Wie du deinem Kind Kontrolle gibst, ohne es zu überfordern – sofort im Alltag umsetzbar.", min: 12 },
  { num: "05", title: "Das Führungsparadox", desc: "Wie du Machtkämpfe vermeidest und stattdessen eine harmonische Zusammenarbeit auf Augenhöhe schaffst.", min: 7 },
  { num: "06", title: "Erste Hilfe bei Wutanfällen", desc: "Schnelle, klare Maßnahmen für akute Situationen – damit du in Ausnahmemomenten ruhig bleibst.", min: 7 },
  { num: "07", title: "Zen-Mama: Empathie & Gelassenheit", desc: "Wie du empathisch bleibst und deinem Kind hilfst, Gefühle zu regulieren – ohne dich selbst zu überfordern.", min: 12 },
  { num: "08", title: "Frustrationstoleranz stärken", desc: "5 konkrete Übungen, die dein Kind lernen lassen, mit Frust umzugehen – für weniger Wutausbrüche.", min: 7 },
  { num: "09", title: "Wutanfälle in der Öffentlichkeit", desc: "Wie du reagierst, wenn dein Kind beim Einkaufen oder bei Besuch einen Ausbruch erlebt.", min: 10 },
  { num: "10", title: "Bindungsorientiert erziehen", desc: "Wie eine starke Bindung Wutanfälle reduziert und wie du eine tiefere Verbindung zu deinem Kind aufbaust.", min: 10 },
  { num: "11", title: "Abschluss & Ausblick", desc: "Zusammenfassung der wichtigsten Erkenntnisse und wie du das Gelernte langfristig in den Alltag integrierst.", min: 5 },
];

const bonusModules = [
  "Erziehungsmodelle im Überblick (autoritär, bindungsorientiert & mehr)",
  "Warum dein Kind nur auf dich hört, wenn du laut wirst",
  "Konsequenzen geben ohne zu drohen",
  "Der Unterschied zwischen Konsequenzen und Strafen",
  "Warum man Kinder nicht bestrafen sollte",
];

const painPoints = [
  { icon: "🛒", title: "Der Supermarkt-Albtraum", desc: "Dein Kind wirft sich schreiend auf den Boden, weil es die Süßigkeit nicht bekommt – und alle Blicke richten sich auf dich." },
  { icon: "⏰", title: "Morgens der tägliche Kampf", desc: "Anziehen, Zähneputzen, Frühstücken – jede Kleinigkeit wird zur Diskussion. Der Tag beginnt schon mit Stress." },
  { icon: "😤", title: "Du wirst lauter als du möchtest", desc: "Irgendwann platzt dir der Kragen. Danach sitzt du abends erschöpft da und fragst dich, warum das Mamaleben so anstrengend ist." },
  { icon: "🍞", title: "Wutanfall wegen Nichtigkeiten", desc: "Das Brot falsch durchgeschnitten, den Becher in der falschen Farbe – und schon bricht eine Welt zusammen." },
  { icon: "😔", title: "Das schlechte Gewissen", desc: "Du liebst dein Kind über alles, aber manchmal bist du so erschöpft, dass du dich fragst, ob du als Mutter gut genug bist." },
  { icon: "🔄", title: "Immer wieder derselbe Kreislauf", desc: "Du probierst alles – mal streng, mal nachgiebig – aber nichts scheint dauerhaft zu helfen." },
];

const testimonials = [
  { name: "Sarah M.", role: "Mama eines 3-jährigen Sohnes", text: "Ich habe endlich verstanden, warum mein Sohn so reagiert. Seitdem bin ich viel ruhiger und unsere Morgende sind komplett entspannt. Ich wünschte, ich hätte das früher gewusst!" },
  { name: "Julia K.", role: "Mama einer 2-jährigen Tochter", text: "Das Modul über Erste Hilfe bei Wutanfällen hat mir wirklich geholfen. Ich weiß jetzt genau, was ich tun soll – und meine Tochter beruhigt sich viel schneller." },
  { name: "Mia R.", role: "Mama von zwei Kindern (2 und 4 Jahre)", text: "Darleens Art zu erklären ist so verständlich und ohne Schuldgefühle. Endlich fühle ich mich nicht mehr als schlechte Mutter, sondern verstehe einfach, was gerade passiert." },
];

const faqs = [
  { q: "Für welches Alter ist der Kurs geeignet?", a: "Der Kurs ist speziell für Eltern von Kindern zwischen 1,5 und 6 Jahren konzipiert. In dieser Zeit durchlaufen Kinder die Autonomiephase (auch Trotzphase genannt), in der die Inhalte des Kurses am relevantesten sind." },
  { q: "Wie lange habe ich Zugang zum Kurs?", a: "Du erhältst dauerhaften Zugang zum Kurs. Du kannst die Videos jederzeit und so oft du möchtest anschauen – auch wenn dein zweites Kind in die Autonomiephase kommt." },
  { q: "Ich bin kein Experte – ist der Kurs auch für mich verständlich?", a: "Absolut! Der Kurs ist von einer Mama für Mamas entwickelt worden. Darleen erklärt alle Konzepte in einfacher, alltagsnaher Sprache – ohne Fachjargon, dafür mit vielen praktischen Beispielen." },
  { q: "Muss ich viel Zeit investieren?", a: "Nein. Die einzelnen Videos sind zwischen 5 und 12 Minuten lang. Du kannst den Kurs in deinem eigenen Tempo absolvieren – auch in kleinen Häppchen während der Mittagspause oder nach dem Schlafenlegen." },
  { q: "Ist der Ansatz zu 'weich'? Ich möchte meinem Kind trotzdem Grenzen setzen.", a: "Bindungsorientierte Erziehung bedeutet nicht, keine Grenzen zu setzen – ganz im Gegenteil. Du lernst, wie du klare, liebevolle Grenzen setzt, die dein Kind auch wirklich akzeptiert. Ohne Schreien, ohne Strafen, ohne Machtkämpfe." },
  { q: "Funktioniert das wirklich – auch bei meinem Kind?", a: "Die Strategien im Kurs basieren auf Entwicklungspsychologie und wurden von Darleen selbst mit ihren eigenen Kindern erprobt. Natürlich ist jedes Kind einzigartig – aber die Grundprinzipien der Autonomiephase gelten für alle Kinder in diesem Alter." },
];

// ── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "1.25rem 0",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          textAlign: "left",
          background: "none",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          cursor: "pointer",
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700,
          fontSize: "1.05rem",
          color: "var(--foreground)",
          padding: 0,
        }}
      >
        <span>{q}</span>
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
            transition: "all 0.25s",
          }}
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p style={{ marginTop: "0.75rem", color: "var(--muted-foreground)", lineHeight: 1.7, fontSize: "0.97rem" }}>
          {a}
        </p>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistSubmitted(true);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "var(--cream)", color: "var(--foreground)" }}>

      {/* ── NAVIGATION ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navScrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: navScrolled ? "blur(12px)" : "none",
        boxShadow: navScrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.3s ease",
        padding: "1rem 0",
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.4rem", color: "var(--teal)" }}>
            ⚓ Mama-Hafen
          </div>
          <button className="btn-coral" onClick={() => scrollTo("kurs")} style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}>
            Zum Kurs ↓
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: "5rem", minHeight: "100vh", display: "flex", alignItems: "center", background: "var(--cream)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}
            className="hero-grid">
            {/* Text */}
            <div>
              <FadeUp>
                <span style={{
                  display: "inline-block", background: "var(--teal)", color: "white",
                  fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "0.4rem 1.1rem", borderRadius: 50, marginBottom: "1.5rem",
                }}>
                  ⚓ Online-Kurs für Mamas
                </span>
              </FadeUp>
              <FadeUp delay={100}>
                <h1 style={{
                  fontFamily: "'Playfair Display', serif", fontWeight: 800,
                  fontSize: "clamp(2.2rem, 5vw, 3.4rem)", lineHeight: 1.15,
                  marginBottom: "1.5rem", color: "var(--foreground)",
                }}>
                  Ist dein Kind plötzlich ein kleiner{" "}
                  <span style={{ color: "var(--teal)", fontStyle: "italic" }}>Tyrann?</span>
                </h1>
              </FadeUp>
              <FadeUp delay={200}>
                <p style={{ fontSize: "1.1rem", lineHeight: 1.75, color: "var(--muted-foreground)", marginBottom: "2rem", maxWidth: 500 }}>
                  Oder steckt etwas ganz anderes dahinter? Lerne, die Autonomiephase deines Kindes zu verstehen, Wutanfälle liebevoll zu begleiten und endlich wieder{" "}
                  <strong style={{ color: "var(--foreground)" }}>Harmonie in euren Familienalltag</strong> zu bringen – ohne ständige Machtkämpfe.
                </p>
              </FadeUp>
              <FadeUp delay={300}>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                  <button className="btn-coral" onClick={() => scrollTo("kurs")}>
                    Jetzt mehr erfahren ↓
                  </button>
                  <button className="btn-teal-outline" onClick={() => scrollTo("fuer-wen")}>
                    Ist das für mich?
                  </button>
                </div>
              </FadeUp>
              <FadeUp delay={400}>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                  {["✓ Praxisnah", "✓ Sofort anwendbar", "✓ Von einer Mama für Mamas"].map(t => (
                    <span key={t} style={{ fontSize: "0.88rem", color: "var(--teal)", fontWeight: 700 }}>{t}</span>
                  ))}
                </div>
              </FadeUp>
            </div>
            {/* Image */}
            <FadeUp delay={200} className="hero-image-wrap">
              <div style={{ position: "relative" }}>
                <div style={{
                  borderRadius: "60% 40% 55% 45% / 50% 45% 55% 50%",
                  overflow: "hidden",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.15)",
                  aspectRatio: "4/5",
                }}>
                  <img src={IMG_HERO} alt="Mama begleitet Kind liebevoll durch Wutanfall" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                {/* Floating badge */}
                <div style={{
                  position: "absolute", bottom: "2rem", left: "-2rem",
                  background: "white", borderRadius: 16, padding: "1rem 1.4rem",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                  display: "flex", alignItems: "center", gap: "0.8rem",
                  maxWidth: 240,
                }}>
                  <span style={{ fontSize: "1.8rem" }}>🎬</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--foreground)" }}>11 Video-Lektionen</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>Schritt für Schritt durch die Autonomiephase</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{ background: "var(--teal)", padding: "1.2rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "2rem" }}>
            {[
              ["🎬", "11 Praxis-Videos"],
              ["⏱️", "Über 90 Min. Inhalt"],
              ["📱", "Jederzeit abrufbar"],
              ["👶", "Für Kinder 1,5–6 Jahre"],
              ["💛", "Von Mama für Mamas"],
              ["🎁", "5 Bonus-Lektionen"],
            ].map(([icon, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "white", fontSize: "0.9rem", fontWeight: 700 }}>
                <span>{icon}</span><span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PAIN SECTION ── */}
      <section style={{ background: "var(--sand)", padding: "6rem 0 4rem" }}>
        <WaveDivider fill="var(--sand)" bg="var(--cream)" flip />
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ color: "var(--coral)", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Erkennst du dich wieder?</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", marginTop: "0.6rem", fontWeight: 800 }}>
                Diese Momente kennt fast jede Mama
              </h2>
              <p style={{ color: "var(--muted-foreground)", maxWidth: 560, margin: "1rem auto 0", lineHeight: 1.7 }}>
                Du bist nicht allein. Die Autonomiephase bringt fast alle Eltern an ihre Grenzen – und das hat nichts damit zu tun, dass du als Mutter versagst.
              </p>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {painPoints.map((p, i) => (
              <FadeUp key={p.title} delay={i * 80}>
                <div style={{
                  background: "white", borderRadius: 20, padding: "1.8rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                  cursor: "default",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 35px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{p.icon}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.6rem" }}>{p.title}</h3>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.93rem", lineHeight: 1.65 }}>{p.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
        <WaveDivider fill="var(--teal)" bg="var(--sand)" />
      </section>

      {/* ── REFRAME ── */}
      <section style={{ background: "var(--teal)", padding: "5rem 0", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <FadeUp>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, lineHeight: 1.3, marginBottom: "1.5rem" }}>
              Was wäre, wenn dein Kind<br />kein Tyrann ist?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "1.1rem", lineHeight: 1.75, marginBottom: "2.5rem" }}>
              Was wäre, wenn diese Wutanfälle ein Zeichen dafür sind, dass dein Kind gerade etwas unglaublich Wichtiges lernt? Und was wäre, wenn du mit den richtigen Werkzeugen nicht nur deinem Kind helfen, sondern auch selbst viel mehr Gelassenheit finden könntest?
            </p>
            <button
              className="btn-coral"
              onClick={() => scrollTo("kurs")}
              style={{ background: "white", color: "var(--teal)", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
            >
              Ich möchte mehr erfahren
            </button>
          </FadeUp>
        </div>
        <WaveDivider fill="var(--cream)" bg="var(--teal)" />
      </section>

      {/* ── ÜBER DARLEEN ── */}
      <section style={{ background: "var(--cream)", padding: "6rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "5rem", alignItems: "center" }} className="about-grid">
            <FadeUp>
              <div style={{
                borderRadius: "40% 60% 50% 50% / 45% 50% 50% 55%",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                aspectRatio: "3/4",
              }}>
                <img src={IMG_DARLEEN} alt="Darleen, Kursleiterin Mama-Hafen" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </FadeUp>
            <div>
              <FadeUp>
                <span style={{ color: "var(--coral)", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Deine Kursleiterin</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, marginTop: "0.6rem", marginBottom: "1.2rem" }}>
                  Hallo, ich bin Darleen.
                </h2>
              </FadeUp>
              <FadeUp delay={100}>
                <p style={{ lineHeight: 1.75, color: "var(--muted-foreground)", marginBottom: "1.2rem" }}>
                  Zweifache Mama und ich kenne diese Verzweiflung nur zu gut. Die Autonomiephase hat mich damals aus der Bahn geworfen und aus mir einen Menschen gemacht, den ich kaum noch wiedererkannt habe. Ich war ständig laut, stritt mich mit meinen Kindern und machte mich danach selbst fertig.
                </p>
              </FadeUp>
              <FadeUp delay={150}>
                <blockquote style={{
                  borderLeft: "4px solid var(--teal)",
                  paddingLeft: "1.5rem",
                  margin: "1.5rem 0",
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  color: "var(--teal-dark)",
                  lineHeight: 1.6,
                }}>
                  „Ich wollte raus aus diesem Mindset – und konnte mit den richtigen Werkzeugen nicht nur meinen Kindern helfen, sondern auch selbst viel mehr Gelassenheit finden."
                </blockquote>
              </FadeUp>
              <FadeUp delay={200}>
                <p style={{ lineHeight: 1.75, color: "var(--muted-foreground)" }}>
                  Ich habe mich intensiv mit Entwicklungspsychologie beschäftigt, alles gelesen, was ich finden konnte – und war schockiert, wie vieles, was ich über die Trotzphase geglaubt hatte, schlicht falsch war. Heute sieht unser Familienalltag komplett anders aus: entspannte Morgende, weniger Wutanfälle und eine viel tiefere Verbindung zu meinen Kindern.
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── VORHER / NACHHER ── */}
      <section style={{ background: "var(--sand)", padding: "6rem 0" }}>
        <WaveDivider fill="var(--sand)" bg="var(--cream)" flip />
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ color: "var(--coral)", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Deine Veränderung</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, marginTop: "0.6rem" }}>
                Vorher vs. Nachher
              </h2>
              <p style={{ color: "var(--muted-foreground)", marginTop: "0.8rem" }}>Das ist keine Magie – es ist das Ergebnis von Verstehen, Strategien und ein bisschen Übung.</p>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="compare-grid">
            <FadeUp delay={100}>
              <div style={{ background: "white", borderRadius: 20, padding: "2rem", border: "2px solid #fecaca" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.2rem", color: "#dc2626" }}>😔 Heute – ohne den Kurs</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {["Morgens beginnt der Tag mit Stress und Konflikten", "Jeder Wutanfall fühlt sich wie ein persönliches Versagen an", "Du weißt nicht, wie du in der Öffentlichkeit reagieren sollst", "Du wirst lauter, als du möchtest – und schämst dich danach", "Das Gefühl, ständig gegen eine Wand zu rennen", "Abends bist du so erschöpft, dass keine Energie für dich bleibt"].map(t => (
                    <li key={t} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.93rem", color: "var(--muted-foreground)" }}>
                      <span style={{ color: "#dc2626", flexShrink: 0, marginTop: 2 }}>✗</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
            <FadeUp delay={200}>
              <div style={{ background: "white", borderRadius: 20, padding: "2rem", border: "2px solid var(--teal-light)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.2rem", color: "var(--teal)" }}>😊 Bald – mit dem Mama-Hafen-Kurs</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {["Ruhige, entspannte Morgende – ohne tägliche Diskussionen", "Du verstehst, was hinter Wutanfällen steckt und reagierst gelassen", "Konkrete Erste-Hilfe-Strategien für jede Situation", "Du setzt Grenzen liebevoll – ohne Machtkämpfe", "Eine tiefere, stärkere Bindung zu deinem Kind", "Du genießt das Mamasein wieder – mit mehr Leichtigkeit"].map(t => (
                    <li key={t} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.93rem", color: "var(--muted-foreground)" }}>
                      <span style={{ color: "var(--teal)", flexShrink: 0, marginTop: 2 }}>✓</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
        <WaveDivider fill="var(--cream)" bg="var(--sand)" />
      </section>

      {/* ── KURSMODULE ── */}
      <section id="kurs" style={{ background: "var(--cream)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ color: "var(--coral)", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Der Kurs</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, marginTop: "0.6rem" }}>
                Was dich im Mama-Hafen erwartet
              </h2>
              <p style={{ color: "var(--muted-foreground)", maxWidth: 560, margin: "1rem auto 0", lineHeight: 1.7 }}>
                11 praxisnahe Video-Lektionen, die dich Schritt für Schritt durch die Autonomiephase begleiten – von der Theorie bis zur sofort anwendbaren Strategie.
              </p>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
            {modules.map((m, i) => (
              <FadeUp key={m.num} delay={i * 60}>
                <div style={{
                  background: "white", borderRadius: 20, padding: "1.8rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                  height: "100%",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 35px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
                >
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <span style={{
                      background: "var(--teal)", color: "white",
                      borderRadius: 12, width: 40, height: 40, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "0.85rem",
                    }}>{m.num}</span>
                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", lineHeight: 1.3 }}>{m.title}</h3>
                      <p style={{ color: "var(--muted-foreground)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>{m.desc}</p>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: "var(--sand)", borderRadius: 50, padding: "0.25rem 0.75rem", fontSize: "0.8rem", color: "var(--teal)", fontWeight: 700 }}>
                        ⏱ {m.min} Min.
                      </span>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Bonus */}
          <FadeUp>
            <div style={{
              background: "linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)",
              borderRadius: 24, padding: "2.5rem",
              color: "white",
            }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.5rem" }}>
                🎁 Bonus: 5 zusätzliche Lektionen inklusive
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "0.75rem" }}>
                {bonusModules.map(b => (
                  <div key={b} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.93rem" }}>
                    <span style={{ color: "#fbbf24", flexShrink: 0 }}>⭐</span>
                    <span style={{ opacity: 0.92 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FÜR WEN ── */}
      <section id="fuer-wen" style={{ background: "var(--sand)", padding: "6rem 0" }}>
        <WaveDivider fill="var(--sand)" bg="var(--cream)" flip />
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ color: "var(--coral)", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Für wen ist dieser Kurs?</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, marginTop: "0.6rem" }}>
                Dieser Kurs ist genau richtig für dich, wenn…
              </h2>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="compare-grid">
            <FadeUp delay={100}>
              <div style={{ background: "white", borderRadius: 20, padding: "2rem", border: "2px solid var(--teal-light)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.2rem", color: "var(--teal)" }}>✅ Dieser Kurs ist für dich</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {["Dein Kind ist zwischen 1,5 und 6 Jahren alt", "Du dich von Wutanfällen überfordert und hilflos fühlst", "Du aufgehört hast zu glauben, dass Strafen und Druck wirklich helfen", "Du eine tiefere Verbindung zu deinem Kind aufbauen möchtest", "Du praktische Strategien suchst, die sofort im Alltag funktionieren", "Du dir mehr Gelassenheit und weniger Schuldgefühle wünschst"].map(t => (
                    <li key={t} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.93rem", color: "var(--muted-foreground)" }}>
                      <span style={{ color: "var(--teal)", flexShrink: 0, marginTop: 2 }}>✓</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
            <FadeUp delay={200}>
              <div style={{ background: "white", borderRadius: 20, padding: "2rem", border: "2px solid var(--sand-dark)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.2rem", color: "var(--muted-foreground)" }}>⚠️ Dieser Kurs ist nicht für dich, wenn…</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {["Du nach einer schnellen 'Wunderlösung' suchst, die ohne Übung funktioniert", "Du glaubst, dass Kinder durch Strenge und Strafen am besten lernen", "Du nicht bereit bist, auch dein eigenes Verhalten zu reflektieren", "Dein Kind älter als 6 Jahre ist (andere Entwicklungsphase)"].map(t => (
                    <li key={t} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.93rem", color: "var(--muted-foreground)" }}>
                      <span style={{ flexShrink: 0, marginTop: 2 }}>⚠️</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
        <WaveDivider fill="var(--cream)" bg="var(--sand)" />
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: "var(--cream)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ color: "var(--coral)", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Stimmen aus der Community</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, marginTop: "0.6rem" }}>
                Was andere Mamas sagen
              </h2>
              <p style={{ color: "var(--muted-foreground)", marginTop: "0.8rem" }}>Diese Erfahrungen zeigen, was möglich ist, wenn man die Autonomiephase wirklich versteht.</p>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {testimonials.map((t, i) => (
              <FadeUp key={t.name} delay={i * 100}>
                <div style={{
                  background: "white", borderRadius: 20, padding: "2rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  position: "relative",
                }}>
                  <div style={{ color: "#fbbf24", fontSize: "1rem", marginBottom: "1rem", letterSpacing: 2 }}>★★★★★</div>
                  <p style={{ color: "var(--muted-foreground)", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "1.5rem", fontStyle: "italic" }}>
                    „{t.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "var(--teal)", color: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "1.1rem",
                    }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>{t.name}</div>
                      <div style={{ color: "var(--muted-foreground)", fontSize: "0.82rem" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / WARTELISTE ── */}
      <section style={{ background: "var(--teal)", padding: "6rem 0", textAlign: "center" }}>
        <WaveDivider fill="var(--teal)" bg="var(--cream)" flip />
        <div className="container" style={{ maxWidth: 720 }}>
          <FadeUp>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.4rem 1rem", borderRadius: 50, marginBottom: "1.2rem" }}>
              ⚓ Dein nächster Schritt
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, lineHeight: 1.25, marginBottom: "1rem" }}>
              Werde der sichere Hafen für dein Kind
            </h2>
            <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: "2.5rem" }}>
              Hol dir jetzt die Werkzeuge, um die Autonomiephase nicht nur zu überleben, sondern gestärkt daraus hervorzugehen – mit mehr Gelassenheit, weniger Machtkämpfen und einer tieferen Verbindung zu deinem Kind.
            </p>
          </FadeUp>
          <FadeUp delay={150}>
            {!waitlistSubmitted ? (
              <form onSubmit={handleWaitlist}>
                <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap", maxWidth: 640, margin: "0 auto 1rem" }}>
                  <input
                    type="text"
                    placeholder="Dein Vorname"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      flex: 1, minWidth: 180,
                      padding: "0.95rem 1.3rem",
                      border: "none", borderRadius: 50,
                      fontSize: "1rem", fontFamily: "'Nunito', sans-serif",
                      outline: "none",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Deine E-Mail-Adresse"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      flex: 1.5, minWidth: 200,
                      padding: "0.95rem 1.3rem",
                      border: "none", borderRadius: 50,
                      fontSize: "1rem", fontFamily: "'Nunito', sans-serif",
                      outline: "none",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                  />
                  <button type="submit" className="btn-coral" style={{ whiteSpace: "nowrap" }}>
                    Auf die Warteliste ⚓
                  </button>
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                  Kein Spam. Nur eine Nachricht, wenn der Kurs verfügbar ist. Jederzeit abmeldbar.
                </p>
              </form>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "2rem", maxWidth: 500, margin: "0 auto" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎉</div>
                <p style={{ color: "white", fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                  Super, {name}! Du stehst auf der Liste.
                </p>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem" }}>
                  Wir melden uns an <strong>{email}</strong>, sobald der Kurs verfügbar ist.
                </p>
              </div>
            )}
          </FadeUp>
        </div>
        <WaveDivider fill="var(--sand)" bg="var(--teal)" />
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "var(--sand)", padding: "6rem 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span style={{ color: "var(--coral)", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Häufige Fragen</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 800, marginTop: "0.6rem" }}>
                Du hast noch Fragen?
              </h2>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <div style={{ background: "white", borderRadius: 24, padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              {faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </FadeUp>
        </div>
        <WaveDivider fill="var(--teal)" bg="var(--sand)" />
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: "var(--teal)", padding: "5rem 0", textAlign: "center" }}>
        <div className="container">
          <FadeUp>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1rem" }}>
              Bereit für mehr Harmonie in deiner Familie?
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: "2rem" }}>
              Dein Kind wartet auf seinen sicheren Hafen.
            </h2>
            <button className="btn-coral" onClick={() => scrollTo("kurs")} style={{ fontSize: "1.1rem", padding: "1.1rem 2.8rem" }}>
              Jetzt zum Kurs ⚓
            </button>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "var(--teal-dark)", padding: "2.5rem 0", textAlign: "center" }}>
        <div className="container">
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.2rem", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>
            ⚓ Mama-Hafen
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {[["darvismedia.de", "https://darvismedia.de"], ["Impressum", "#"], ["Datenschutz", "#"], ["Kontakt", "#"]].map(([label, href]) => (
              <a key={label} href={href} style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
              >{label}</a>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} Mama-Hafen · Ein Kurs von Darleen · Alle Rechte vorbehalten
          </p>
        </div>
      </footer>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .hero-image-wrap { order: -1; }
          .about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
