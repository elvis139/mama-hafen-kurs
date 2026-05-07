/**
 * Mama-Hafen Kursbereich
 * Design: Coastal Calm – DM Serif Display + DM Sans, Teal + Sand + Coral
 *
 * Zugang: Session-Token aus localStorage
 * Video-Hosting: bunny.net Stream (Library ID: 655693)
 * Enthält: 11 Kursmodule mit bunny.net-Player + Modul-PDFs + Workbook-Download
 */

import { trpc } from "@/lib/trpc";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

const WORKBOOK_URL = "/manus-storage/Mama-Hafen-Workbook_3f11ba7d.pdf";
const BUNNY_LIBRARY_ID = "655693";

const modules = [
  {
    num: "01",
    title: "Begrüßung & Überblick",
    desc: "Willkommen im Mama-Hafen! Darleen stellt den Kurs vor und erklärt, was dich erwartet.",
    bunnyId: null as string | null,
    pdfUrl: "/manus-storage/1._Begruungsvideo_(fertig)_edb1c6a2.pdf",
  },
  {
    num: "02",
    title: "Ist mein Kind ein kleiner Tyrann?",
    desc: "Warum dein Kind sich so verhält – und warum es kein schlechtes Zeichen ist.",
    bunnyId: null as string | null,
    pdfUrl: "/manus-storage/2._Ist_mein_Kind_ein_Tyrann_(fertig)_07b9e47d.pdf",
  },
  {
    num: "03",
    title: "Die Autonomiephase verstehen",
    desc: "Was im Gehirn deines Kindes passiert und warum diese Phase so wichtig ist.",
    bunnyId: null as string | null,
    pdfUrl: "/manus-storage/3._Die_Autonomiephase_(fertig)_b707ec61.pdf",
  },
  {
    num: "04",
    title: "Die Illusion der Wahl",
    desc: "Wie du deinem Kind das Gefühl von Kontrolle gibst – ohne die Führung zu verlieren.",
    bunnyId: null as string | null,
    pdfUrl: "/manus-storage/4._Die_Illusion_der_Wahl_(fertig)_9f509a89.pdf",
  },
  {
    num: "05",
    title: "Das Führungsparadox",
    desc: "Warum liebevolle Führung keine Schwäche ist – sondern die stärkste Form der Erziehung.",
    bunnyId: null as string | null,
    pdfUrl: "/manus-storage/5._Das_Fuhrungsparadox_(fertig)_1eafc149.pdf",
  },
  {
    num: "06",
    title: "Erste Hilfe bei Wutanfällen",
    desc: "Konkrete Strategien für den Moment, wenn der Sturm losbricht.",
    bunnyId: null as string | null,
    pdfUrl: "/manus-storage/6._Erste_Hilfe_bei_Wutanfallen_(fertig)_1d990ea9.pdf",
  },
  {
    num: "07",
    title: "Zen-Mama: Empathie & Gelassenheit",
    desc: "Wie du selbst ruhig bleibst – auch wenn dein Kind es nicht ist.",
    bunnyId: null as string | null,
    pdfUrl: "/manus-storage/7._Empathie_und_Gelassenheit_(fertig)_b34eba6e.pdf",
  },
  {
    num: "08",
    title: "Frustrationstoleranz stärken",
    desc: "Übungen, die deinem Kind helfen, mit Frust umzugehen – langfristig.",
    bunnyId: null as string | null,
    pdfUrl: "/manus-storage/8._Ubungen_zur_Starkung_der_Frustrationstoleranz_(fertig)__4b406dc0.pdf",
  },
  {
    num: "09",
    title: "Wutanfälle in der Öffentlichkeit",
    desc: "Was tun, wenn der Wutanfall im Supermarkt oder auf dem Spielplatz passiert?",
    bunnyId: null as string | null,
    pdfUrl: "/manus-storage/9._Wutanfalle_in_der_Offentlichkeit_df4b0416.pdf",
  },
  {
    num: "10",
    title: "Bindungsorientiert erziehen",
    desc: "Wie eine starke Bindung Trotzanfälle reduziert und das Familienleben entspannt.",
    bunnyId: "539d2943-7fc7-4e3b-a3fe-4df03f6efb38",
    pdfUrl: "/manus-storage/10._Bindungsorientiert_(fertig)_42ac071e.pdf",
  },
  {
    num: "11",
    title: "Abschluss & Ausblick",
    desc: "Zusammenfassung, nächste Schritte und Darlens persönliche Botschaft an dich.",
    bunnyId: "605051f1-86ed-44ef-a66c-4f002b95c810",
    pdfUrl: "/manus-storage/11._Mama-Hafen_(fertig)_844234c9.pdf",
  },
];

function BunnyPlayer({ videoId, libraryId, title }: { videoId: string; libraryId: string; title: string }) {
  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        // overflow:visible ist wichtig – overflow:hidden blockiert Vollbild
        overflow: "visible",
      }}
    >
      <iframe
        src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
}

function VideoPlaceholder() {
  return (
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
        borderRadius: "20px 20px 0 0",
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
  );
}

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
      className="kurs-page"
      style={{
        minHeight: "100svh",
        background: "var(--cream)",
        fontFamily: "'DM Sans', sans-serif",
        color: "var(--foreground)",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background: "var(--teal)",
          padding: "0.75rem 0",
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
            gap: "0.5rem",
          }}
        >
          <a
            href="/"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(0.95rem, 3.5vw, 1.15rem)",
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            ⚓ Mama-Hafen
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
            {data?.email && (
              <span style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "clamp(0.68rem, 2vw, 0.82rem)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "clamp(80px, 20vw, 180px)",
              }}>
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
                padding: "clamp(0.28rem, 1.2vw, 0.4rem) clamp(0.5rem, 2vw, 0.8rem)",
                fontSize: "clamp(0.68rem, 2.2vw, 0.8rem)",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap",
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
          {/* Video-Player + Infos */}
          <div>
            {/* Video-Bereich */}
            <div
              style={{
                background: "white",
                borderRadius: 20,
                // overflow:hidden bewusst weggelassen – blockiert sonst Vollbild
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                marginBottom: "1.2rem",
              }}
            >
              {currentModule?.bunnyId ? (
                <BunnyPlayer
                  videoId={currentModule.bunnyId}
                  libraryId={BUNNY_LIBRARY_ID}
                  title={currentModule.title}
                />
              ) : (
                <VideoPlaceholder />
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
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", lineHeight: 1.65, margin: "0 0 1rem" }}>
                  {currentModule?.desc}
                </p>

                {/* Modul-PDF Download */}
                {currentModule?.pdfUrl && (
                  <a
                    href={currentModule.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "var(--sand)",
                      color: "var(--teal)",
                      borderRadius: 10,
                      padding: "0.5rem 1rem",
                      fontSize: "0.83rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      border: "1.5px solid var(--teal)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "var(--teal)";
                      (e.currentTarget as HTMLAnchorElement).style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "var(--sand)";
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--teal)";
                    }}
                  >
                    📄 Arbeitsblatt zu Lektion {currentModule.num} öffnen
                  </a>
                )}
              </div>
            </div>

            {/* Workbook-Download */}
            <a
              href={WORKBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
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
                  Reflexionsfragen · Übungen · Notizen · PDF
                </div>
              </div>
            </a>
          </div>

          {/* Modulliste */}
          <div style={{ minWidth: 0, width: "100%" }}>
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
                width: "100%",
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
                  <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                    <div
                      className="module-btn-title"
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
                  {m.bunnyId ? (
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
        /* Verhindert horizontales Scrollen durch Elemente die breiter als viewport sind */
        .kurs-page, .kurs-page * {
          box-sizing: border-box;
        }
        .kurs-page {
          max-width: 100vw;
          overflow-x: hidden;
        }
        /* Modulliste: Text nicht abschneiden auf Mobile */
        .module-btn-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: calc(100vw - 120px);
        }
        @media (min-width: 768px) {
          .kurs-grid {
            grid-template-columns: 3fr 2fr !important;
          }
          .module-btn-title {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
