/**
 * Mama-Hafen Kursbereich
 * Design: Coastal Calm – DM Serif Display + DM Sans, Teal + Sand + Coral
 *
 * Zugang: Session-Token aus localStorage
 * Enthält: 11 Kursmodule mit YouTube-Platzhaltern + Workbook-Download
 */

import { trpc } from "@/lib/trpc";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

const WORKBOOK_URL = "/manus-storage/Mama-Hafen-Workbook_a35e7e4f.pdf";

const modules = [
  {
    num: "01",
    title: "Begrüßung & Überblick",
    desc: "Willkommen im Mama-Hafen! Darleen stellt den Kurs vor und erklärt, was dich erwartet.",
    youtubeId: "POKQarEGw6Y",
  },
  {
    num: "02",
    title: "Ist mein Kind ein kleiner Tyrann?",
    desc: "Warum dein Kind sich so verhält – und warum es kein schlechtes Zeichen ist.",
    youtubeId: "FMFdMw1bOTo",
  },
  {
    num: "03",
    title: "Die Autonomiephase verstehen",
    desc: "Was im Gehirn deines Kindes passiert und warum diese Phase so wichtig ist.",
    youtubeId: "lS5-qW3MyOA",
  },
  {
    num: "04",
    title: "Die Illusion der Wahl",
    desc: "Wie du deinem Kind das Gefühl von Kontrolle gibst – ohne die Führung zu verlieren.",
    youtubeId: "ZaYS81EhKUM",
  },
  {
    num: "05",
    title: "Das Führungsparadox",
    desc: "Warum liebevolle Führung keine Schwäche ist – sondern die stärkste Form der Erziehung.",
    youtubeId: "roQoWTt54qI",
  },
  {
    num: "06",
    title: "Erste Hilfe bei Wutanfällen",
    desc: "Konkrete Strategien für den Moment, wenn der Sturm losbricht.",
    youtubeId: "nxAo-IiGDn0",
  },
  {
    num: "07",
    title: "Zen-Mama: Empathie & Gelassenheit",
    desc: "Wie du selbst ruhig bleibst – auch wenn dein Kind es nicht ist.",
    youtubeId: "m0LCn3ltRRE",
  },
  {
    num: "08",
    title: "Frustrationstoleranz stärken",
    desc: "Übungen, die deinem Kind helfen, mit Frust umzugehen – langfristig.",
    youtubeId: "F4AdiCGgGx0",
  },
  {
    num: "09",
    title: "Wutanfälle in der Öffentlichkeit",
    desc: "Was tun, wenn der Wutanfall im Supermarkt oder auf dem Spielplatz passiert?",
    youtubeId: "VuLdUThZvho",
  },
  {
    num: "10",
    title: "Bindungsorientiert erziehen",
    desc: "Wie eine starke Bindung Trotzanfälle reduziert und das Familienleben entspannt.",
    youtubeId: "tCswKzt7QWQ",
  },
  {
    num: "11",
    title: "Abschluss & Ausblick",
    desc: "Zusammenfassung, nächste Schritte und Darlens persönliche Botschaft an dich.",
    youtubeId: "MpsSUo_kEqc",
  },
];

export default function Kurs() {
  const [, navigate] = useLocation();
  const [activeModule, setActiveModule] = useState(0);

  const sessionToken = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mama_hafen_session") ?? "";
    }
    return "";
  }, []);

  const { data, isLoading, error } = trpc.course.getAccess.useQuery(
    { sessionToken },
    {
      enabled: !!sessionToken,
      retry: false,
    }
  );

  useEffect(() => {
    if (!sessionToken) {
      navigate("/kurs/login");
    }
  }, [sessionToken, navigate]);

  useEffect(() => {
    if (error) {
      localStorage.removeItem("mama_hafen_session");
      navigate("/kurs/login");
    }
  }, [error, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("mama_hafen_session");
    navigate("/kurs/login");
  };

  if (!sessionToken || isLoading) {
    return (
      <div
        style={{
          minHeight: "100svh",
          background: "var(--cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
          <p style={{ color: "var(--muted-foreground)" }}>Kurs wird geladen…</p>
        </div>
      </div>
    );
  }

  const currentModule = modules[activeModule];

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--cream)",
        fontFamily: "'DM Sans', sans-serif",
        color: "var(--foreground)",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background: "var(--teal)",
          padding: "0.9rem 0",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
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
          <a
            href="/"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
            }}
          >
            ⚓ Mama-Hafen
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {data?.email && (
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.82rem" }}>
                {data.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 8,
                padding: "0.35rem 0.8rem",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* ── Willkommens-Banner ── */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--teal), #1a5c52)",
          padding: "2.5rem 0 3rem",
          marginBottom: "-1.5rem",
        }}
      >
        <div className="container">
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            Willkommen im Mama-Hafen 🎉
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.97rem", lineHeight: 1.6 }}>
            Du hast Zugang zu allen 11 Lektionen. Starte einfach mit Lektion 01 oder wähle ein Thema aus.
          </p>
        </div>
      </div>

      {/* ── Hauptinhalt ── */}
      <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "3rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.5rem",
          }}
          className="kurs-grid"
        >
          {/* Video-Player */}
          <div>
            {/* Video-Bereich */}
            <div
              style={{
                background: "white",
                borderRadius: 20,
                // overflow:hidden entfernt – blockiert sonst den Vollbild-Modus des iframes
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                marginBottom: "1.2rem",
              }}
            >
              {currentModule?.youtubeId ? (
                // overflow: visible ist wichtig – overflow:hidden blockiert den Vollbild-Modus
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "visible" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${currentModule.youtubeId}?rel=0&controls=0&fs=1&modestbranding=1`}
                    title={currentModule.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      borderRadius: "0",
                    }}
                  />
                </div>
              ) : (
                /* Platzhalter wenn kein YouTube-Video vorhanden */
                <div
                  style={{
                    aspectRatio: "16/9",
                    background: "linear-gradient(135deg, #1a3a3a 0%, var(--teal) 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎬</div>
                  <p
                    style={{
                      color: "white",
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "1.1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Video wird bald verfügbar
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                    Darleen lädt die Videos gerade hoch. Schau bald wieder vorbei!
                  </p>
                </div>
              )}

              {/* Modul-Info unter dem Video */}
              <div style={{ padding: "1.2rem 1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.7rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      background: "var(--teal)",
                      color: "white",
                      borderRadius: 8,
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      flexShrink: 0,
                    }}
                  >
                    {currentModule?.num}
                  </span>
                  <h2
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "1.15rem",
                      margin: 0,
                    }}
                  >
                    {currentModule?.title}
                  </h2>
                </div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>
                  {currentModule?.desc}
                </p>
              </div>
            </div>

            {/* Workbook-Download */}
            <a
              href={WORKBOOK_URL}
              download="Mama-Hafen-Workbook.pdf"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                background: "linear-gradient(135deg, var(--coral), #c0392b)",
                borderRadius: 16,
                padding: "1.2rem 1.5rem",
                textDecoration: "none",
                color: "white",
                boxShadow: "0 4px 18px rgba(232,112,74,0.3)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 24px rgba(232,112,74,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 18px rgba(232,112,74,0.3)";
              }}
            >
              <div style={{ fontSize: "2rem", flexShrink: 0 }}>📥</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.97rem", marginBottom: "0.2rem" }}>
                  Kurs-Workbook herunterladen
                </div>
                <div style={{ opacity: 0.85, fontSize: "0.82rem" }}>
                  41 Seiten · Reflexionsfragen · Übungen · Notizen · PDF
                </div>
              </div>
            </a>
          </div>

          {/* Modulliste */}
          <div>
            <h3
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.1rem",
                marginBottom: "0.8rem",
                color: "var(--foreground)",
              }}
            >
              Alle Lektionen
            </h3>
            <div
              style={{
                background: "white",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
              }}
            >
              {modules.map((m, i) => (
                <button
                  key={m.num}
                  onClick={() => setActiveModule(i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                    padding: "0.8rem 1rem",
                    background: activeModule === i ? "var(--sand)" : "transparent",
                    border: "none",
                    borderBottom: i < modules.length - 1 ? "1px solid var(--border)" : "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (activeModule !== i) (e.currentTarget as HTMLButtonElement).style.background = "var(--cream)";
                  }}
                  onMouseLeave={(e) => {
                    if (activeModule !== i) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      background: activeModule === i ? "var(--teal)" : "var(--sand)",
                      color: activeModule === i ? "white" : "var(--teal)",
                      borderRadius: 7,
                      width: 30,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.72rem",
                      flexShrink: 0,
                      transition: "all 0.15s",
                    }}
                  >
                    {m.num}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: activeModule === i ? 700 : 600,
                        fontSize: "0.88rem",
                        color: activeModule === i ? "var(--teal)" : "var(--foreground)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.title}
                    </div>
                  </div>
                  {m.youtubeId ? (
                    <span style={{ fontSize: "0.75rem", color: "var(--teal)", flexShrink: 0 }}>▶</span>
                  ) : (
                    <span style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", flexShrink: 0 }}>⏳</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "var(--teal-dark, #1a3a3a)",
          padding: "1.5rem 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.76rem", margin: 0 }}>
            © {new Date().getFullYear()} Mama-Hafen · Ein Kurs von Darleen ·{" "}
            <a
              href="https://www.darvismedia.de"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              darvismedia.de
            </a>
          </p>
        </div>
      </footer>

      {/* Responsive Styles */}
      <style>{`
        @media (min-width: 768px) {
          .kurs-grid {
            grid-template-columns: 3fr 2fr !important;
          }
        }
      `}</style>
    </div>
  );
}
