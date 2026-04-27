/**
 * MAMA-HAFEN LANDINGPAGE – Vereinfachte Version
 * Design: "Coastal Calm" – Playfair Display + Nunito
 * Struktur: Hero → 3 Versprechen → Über Darleen → Kursmodule → CTA → FAQ
 */

import { useEffect, useRef, useState } from "react";

const IMG_HERO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663061854558/DswbdQTvMfJMPVPLtDLMpo/mama-hafen-hero-8D3s4D7uWWZgi4Fzfbffn2.webp";
const IMG_DARLEEN =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663061854558/DswbdQTvMfJMPVPLtDLMpo/mama-hafen-darleen-3tkZX2UvXKzMYVRCKEJYfg.webp";

// ── Scroll-Animation ─────────────────────────────────────────────────────────
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

// ── Wellen-Divider ────────────────────────────────────────────────────────────
function Wave({ fill, bg = "transparent", flip = false }: { fill: string; bg?: string; flip?: boolean }) {
  return (
    <div style={{ background: bg, lineHeight: 0, overflow: "hidden" }}>
      <svg viewBox="0 0 1440 50" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 50, transform: flip ? "scaleY(-1)" : "none" }}>
        <path d="M0,25 C480,50 960,0 1440,25 L1440,50 L0,50 Z" fill={fill} />
      </svg>
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)", padding: "1.1rem 0" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", textAlign: "left", background: "none", border: "none",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: "1rem", cursor: "pointer", fontFamily: "'Nunito', sans-serif",
        fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", padding: 0,
      }}>
        <span>{q}</span>
        <span style={{
          flexShrink: 0, width: 26, height: 26, borderRadius: "50%",
          background: open ? "var(--teal)" : "var(--sand)",
          color: open ? "white" : "var(--teal)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.1rem", fontWeight: 700, transition: "all 0.2s",
        }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p style={{ marginTop: "0.7rem", color: "var(--muted-foreground)", lineHeight: 1.7, fontSize: "0.93rem" }}>{a}</p>
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
  { q: "Für welches Alter ist der Kurs geeignet?", a: "Der Kurs ist für Eltern von Kindern zwischen 1,5 und 6 Jahren konzipiert – der klassischen Autonomiephase." },
  { q: "Wie lange habe ich Zugang?", a: "Du erhältst dauerhaften Zugang. Schau die Videos jederzeit und so oft du möchtest – auch wenn dein zweites Kind in die Trotzphase kommt." },
  { q: "Muss ich viel Zeit investieren?", a: "Nein. Die Videos sind 5–12 Minuten lang. Du kannst den Kurs in deinem eigenen Tempo absolvieren – auch in kleinen Häppchen zwischendurch." },
  { q: "Ist der Ansatz zu 'weich'? Ich möchte meinem Kind trotzdem Grenzen setzen.", a: "Bindungsorientiert bedeutet nicht grenzenlos. Du lernst, klare und liebevolle Grenzen zu setzen – ohne Schreien, ohne Strafen, ohne Machtkämpfe." },
  { q: "Funktioniert das auch bei meinem Kind?", a: "Die Strategien basieren auf Entwicklungspsychologie und wurden von Darleen selbst erprobt. Die Grundprinzipien der Autonomiephase gelten für alle Kinder in diesem Alter." },
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

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "var(--cream)", color: "var(--foreground)" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navScrolled ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: navScrolled ? "blur(12px)" : "none",
        boxShadow: navScrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
        transition: "all 0.3s ease", padding: "1rem 0",
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.35rem", color: "var(--teal)" }}>
            ⚓ Mama-Hafen
          </span>
          <button className="btn-coral" onClick={() => scrollTo("warteliste")} style={{ padding: "0.55rem 1.4rem", fontSize: "0.88rem" }}>
            Jetzt anmelden
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: "5rem", minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div className="container">
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>

            {/* Text */}
            <div>
              <FadeUp>
                <span style={{
                  display: "inline-block", background: "var(--teal)", color: "white",
                  fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", padding: "0.35rem 1rem", borderRadius: 50, marginBottom: "1.5rem",
                }}>
                  ⚓ Online-Kurs für Mamas
                </span>
              </FadeUp>
              <FadeUp delay={80}>
                <h1 style={{
                  fontFamily: "'Playfair Display', serif", fontWeight: 800,
                  fontSize: "clamp(2.2rem, 5vw, 3.3rem)", lineHeight: 1.15,
                  marginBottom: "1.4rem",
                }}>
                  Ist dein Kind plötzlich ein kleiner{" "}
                  <em style={{ color: "var(--teal)", fontStyle: "italic" }}>Tyrann?</em>
                </h1>
              </FadeUp>
              <FadeUp delay={160}>
                <p style={{ fontSize: "1.08rem", lineHeight: 1.8, color: "var(--muted-foreground)", marginBottom: "2rem", maxWidth: 480 }}>
                  Lerne, die Autonomiephase zu verstehen, Wutanfälle liebevoll zu begleiten und endlich wieder <strong style={{ color: "var(--foreground)" }}>Ruhe in euren Familienalltag</strong> zu bringen.
                </p>
              </FadeUp>
              <FadeUp delay={240}>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button className="btn-coral" onClick={() => scrollTo("kurs")}>
                    Mehr erfahren ↓
                  </button>
                  <button className="btn-teal-outline" onClick={() => scrollTo("warteliste")}>
                    Auf die Warteliste
                  </button>
                </div>
              </FadeUp>
            </div>

            {/* Bild */}
            <FadeUp delay={180} className="hero-img">
              <div style={{ position: "relative" }}>
                <div style={{
                  borderRadius: "55% 45% 50% 50% / 48% 52% 48% 52%",
                  overflow: "hidden",
                  boxShadow: "0 25px 70px rgba(0,0,0,0.14)",
                  aspectRatio: "4/5",
                }}>
                  <img src={IMG_HERO} alt="Mama begleitet Kind liebevoll" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                {/* Badge */}
                <div style={{
                  position: "absolute", bottom: "1.8rem", left: "-1.5rem",
                  background: "white", borderRadius: 14, padding: "0.9rem 1.2rem",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                  display: "flex", alignItems: "center", gap: "0.7rem",
                }}>
                  <span style={{ fontSize: "1.6rem" }}>🎬</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>11 Video-Lektionen</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>+ 5 Bonus-Module</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 3 VERSPRECHEN ── */}
      <section style={{ background: "var(--sand)", padding: "5rem 0" }}>
        <Wave fill="var(--sand)" bg="var(--cream)" flip />
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.7rem, 3.5vw, 2.3rem)", fontWeight: 800 }}>
                Was du nach dem Kurs anders machst
              </h2>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }} className="promise-grid">
            {[
              { icon: "🧘", title: "Gelassen bleiben", text: "Du verstehst, was hinter Wutanfällen steckt – und reagierst ruhig statt reaktiv." },
              { icon: "🤝", title: "Grenzen ohne Kampf", text: "Du setzt klare Grenzen liebevoll – ohne Schreien, ohne schlechtes Gewissen." },
              { icon: "💛", title: "Tiefere Verbindung", text: "Eine starke Bindung reduziert Trotzanfälle und macht das Mamasein wieder leicht." },
            ].map((p, i) => (
              <FadeUp key={p.title} delay={i * 100}>
                <div style={{
                  background: "white", borderRadius: 20, padding: "2rem",
                  textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 35px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)"; }}
                >
                  <div style={{ fontSize: "2.4rem", marginBottom: "1rem" }}>{p.icon}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.7rem" }}>{p.title}</h3>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.93rem", lineHeight: 1.7 }}>{p.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
        <Wave fill="var(--cream)" bg="var(--sand)" />
      </section>

      {/* ── ÜBER DARLEEN ── */}
      <section style={{ background: "var(--cream)", padding: "5rem 0" }}>
        <div className="container">
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "5rem", alignItems: "center" }}>
            <FadeUp>
              <div style={{
                borderRadius: "42% 58% 48% 52% / 46% 50% 50% 54%",
                overflow: "hidden",
                boxShadow: "0 20px 55px rgba(0,0,0,0.11)",
                aspectRatio: "3/4",
              }}>
                <img src={IMG_DARLEEN} alt="Darleen, Kursleiterin" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </FadeUp>
            <div>
              <FadeUp>
                <span style={{ color: "var(--coral)", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Deine Kursleiterin</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.7rem, 3.5vw, 2.3rem)", fontWeight: 800, marginTop: "0.5rem", marginBottom: "1.2rem" }}>
                  Hallo, ich bin Darleen.
                </h2>
              </FadeUp>
              <FadeUp delay={100}>
                <p style={{ lineHeight: 1.8, color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>
                  Zweifache Mama – und ich kenne diese Erschöpfung aus eigener Erfahrung. Die Autonomiephase hat mich damals an meine Grenzen gebracht. Ich war ständig laut und erkannte mich selbst kaum noch.
                </p>
              </FadeUp>
              <FadeUp delay={160}>
                <blockquote style={{
                  borderLeft: "4px solid var(--teal)", paddingLeft: "1.4rem",
                  margin: "0 0 1.5rem",
                  fontFamily: "'Playfair Display', serif", fontStyle: "italic",
                  fontSize: "1.05rem", color: "var(--teal-dark)", lineHeight: 1.65,
                }}>
                  „Mit den richtigen Werkzeugen konnte ich nicht nur meinen Kindern helfen – sondern auch selbst wieder Gelassenheit finden."
                </blockquote>
              </FadeUp>
              <FadeUp delay={220}>
                <p style={{ lineHeight: 1.8, color: "var(--muted-foreground)" }}>
                  Ich habe mich intensiv mit Entwicklungspsychologie beschäftigt und diesen Kurs entwickelt – damit du nicht so lange suchen musst wie ich.
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── KURSMODULE ── */}
      <section id="kurs" style={{ background: "var(--sand)", padding: "5rem 0" }}>
        <Wave fill="var(--sand)" bg="var(--cream)" flip />
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span style={{ color: "var(--coral)", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Der Kurs</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.7rem, 3.5vw, 2.3rem)", fontWeight: 800, marginTop: "0.5rem" }}>
                11 Lektionen. Schritt für Schritt.
              </h2>
              <p style={{ color: "var(--muted-foreground)", maxWidth: 500, margin: "0.8rem auto 0", lineHeight: 1.7 }}>
                Jedes Video ist 5–12 Minuten kurz und sofort im Alltag anwendbar.
              </p>
            </div>
          </FadeUp>

          {/* Module als kompakte Liste */}
          <FadeUp delay={100}>
            <div style={{
              background: "white", borderRadius: 24, overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)", maxWidth: 800, margin: "0 auto 2.5rem",
            }}>
              {modules.map((m, i) => (
                <div key={m.num} style={{
                  display: "flex", alignItems: "center", gap: "1.2rem",
                  padding: "1rem 1.8rem",
                  borderBottom: i < modules.length - 1 ? "1px solid var(--border)" : "none",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--sand)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <span style={{
                    background: "var(--teal)", color: "white", borderRadius: 10,
                    width: 36, height: 36, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "0.8rem",
                  }}>{m.num}</span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: "0.97rem" }}>{m.title}</span>
                  <span style={{
                    background: "var(--sand)", borderRadius: 50,
                    padding: "0.2rem 0.7rem", fontSize: "0.78rem",
                    color: "var(--teal)", fontWeight: 700, flexShrink: 0,
                  }}>⏱ {m.min} Min.</span>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Bonus kompakt */}
          <FadeUp delay={150}>
            <div style={{
              background: "linear-gradient(135deg, var(--teal), var(--teal-dark))",
              borderRadius: 20, padding: "2rem 2.5rem",
              maxWidth: 800, margin: "0 auto", color: "white",
              display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap",
            }}>
              <div style={{ fontSize: "2.5rem" }}>🎁</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: "0.4rem" }}>5 Bonus-Lektionen inklusive</div>
                <div style={{ opacity: 0.85, fontSize: "0.9rem", lineHeight: 1.6 }}>
                  Erziehungsmodelle · Konsequenzen ohne Drohungen · Warum Strafen nicht helfen
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
        <Wave fill="var(--teal)" bg="var(--sand)" />
      </section>

      {/* ── CTA / WARTELISTE ── */}
      <section id="warteliste" style={{ background: "var(--teal)", padding: "5rem 0", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <FadeUp>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", color: "white",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800,
              lineHeight: 1.25, marginBottom: "1rem",
            }}>
              Werde der sichere Hafen<br />für dein Kind.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "1rem", lineHeight: 1.75, marginBottom: "2.5rem" }}>
              Trag dich jetzt auf die Warteliste ein – du erfährst als Erste, wenn der Kurs verfügbar ist.
            </p>
          </FadeUp>
          <FadeUp delay={120}>
            {!waitlistDone ? (
              <form onSubmit={e => { e.preventDefault(); setWaitlistDone(true); }}>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
                  <input type="text" placeholder="Dein Vorname" required value={name} onChange={e => setName(e.target.value)}
                    style={{ flex: 1, minWidth: 160, padding: "0.9rem 1.2rem", border: "none", borderRadius: 50, fontSize: "0.97rem", fontFamily: "'Nunito', sans-serif", outline: "none" }} />
                  <input type="email" placeholder="Deine E-Mail-Adresse" required value={email} onChange={e => setEmail(e.target.value)}
                    style={{ flex: 1.5, minWidth: 200, padding: "0.9rem 1.2rem", border: "none", borderRadius: 50, fontSize: "0.97rem", fontFamily: "'Nunito', sans-serif", outline: "none" }} />
                  <button type="submit" className="btn-coral" style={{ whiteSpace: "nowrap" }}>
                    Auf die Warteliste ⚓
                  </button>
                </div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>Kein Spam. Jederzeit abmeldbar.</p>
              </form>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 18, padding: "2rem", maxWidth: 460, margin: "0 auto" }}>
                <div style={{ fontSize: "2.2rem", marginBottom: "0.6rem" }}>🎉</div>
                <p style={{ color: "white", fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.4rem" }}>Super, {name}! Du stehst auf der Liste.</p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.92rem" }}>Wir melden uns an <strong>{email}</strong>.</p>
              </div>
            )}
          </FadeUp>
        </div>
        <Wave fill="var(--sand)" bg="var(--teal)" />
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "var(--sand)", padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 800 }}>
                Häufige Fragen
              </h2>
            </div>
          </FadeUp>
          <FadeUp delay={80}>
            <div style={{ background: "white", borderRadius: 22, padding: "1.5rem 2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              {faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </FadeUp>
        </div>
        <Wave fill="var(--teal)" bg="var(--sand)" />
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ background: "var(--teal)", padding: "4rem 0", textAlign: "center" }}>
        <div className="container">
          <FadeUp>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, marginBottom: "1.5rem" }}>
              Dein Kind wartet auf seinen sicheren Hafen.
            </h2>
            <button className="btn-coral" onClick={() => scrollTo("warteliste")} style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}>
              Jetzt auf die Warteliste ⚓
            </button>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "var(--teal-dark)", padding: "2rem 0", textAlign: "center" }}>
        <div className="container">
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", marginBottom: "0.8rem" }}>
            ⚓ Mama-Hafen
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
            {[["darvismedia.de", "https://darvismedia.de"], ["Impressum", "#"], ["Datenschutz", "#"], ["Kontakt", "#"]].map(([label, href]) => (
              <a key={label} href={href} style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >{label}</a>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
            © {new Date().getFullYear()} Mama-Hafen · Ein Kurs von Darleen
          </p>
        </div>
      </footer>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .hero-img { order: -1; }
          .about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .promise-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
