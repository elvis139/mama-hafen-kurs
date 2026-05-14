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

// Fortschritts-Schlüssel im localStorage (pro E-Mail-Adresse)
const getProgressKey = (email: string) => `mama_hafen_progress_${email}`;

function loadProgress(email: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(getProgressKey(email));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(email: string, progress: Record<string, number>) {
  try {
    localStorage.setItem(getProgressKey(email), JSON.stringify(progress));
  } catch {
    // ignore
  }
}

const WORKBOOK_URL = "/manus-storage/Mama-Hafen-Workbook_04f58f4f.pdf";
const BUNNY_LIBRARY_ID = "655693";

const modules = [
  {
    num: "01",
    title: "Begrüßung & Überblick",
    desc: "Willkommen im Mama-Hafen! Darleen stellt sich vor und gibt dir einen Überblick über den Kurs. Du erfährst, was dich in den nächsten Lektionen erwartet, wie du das Workbook am besten nutzt und welche Haltung dir helfen wird, das Gelernte wirklich in deinen Alltag zu integrieren.",
    bunnyId: "6cf7f0a3-7f97-4c77-8240-71e8bc7f0be7",
    pdfUrl: "/manus-storage/1._Begruungsvideo_(fertig)_edb1c6a2.pdf",
    workbookPages: "S. 3–5",
  },
  {
    num: "02",
    title: "Ist mein Kind ein kleiner Tyrann?",
    desc: "Viele Eltern fragen sich, ob ihr Kind sie absichtlich provoziert. In dieser Lektion erfährst du, warum Kinder in der Autonomiephase so handeln wie sie handeln – und warum das kein Zeichen schlechter Erziehung ist. Du lernst, Trotzverhalten neu zu interpretieren und mit mehr Verständnis zu begegnen.",
    bunnyId: "3a0e1ab6-5f47-495c-a4fa-114018c01e03",
    pdfUrl: "/manus-storage/2._Ist_mein_Kind_ein_Tyrann_(fertig)_07b9e47d.pdf",
    workbookPages: "S. 6–8",
  },
  {
    num: "03",
    title: "Die Autonomiephase verstehen",
    desc: "Diese Lektion gibt dir das Hintergrundwissen, das alles verändert: Was passiert neurobiologisch im Gehirn deines Kindes? Warum ist die Autonomiephase entwicklungspsychologisch so bedeutsam? Und warum ist ein Kind, das Grenzen testet, eigentlich auf dem genau richtigen Weg?",
    bunnyId: "84c1cc69-cb4c-44b0-94b1-efbea53419bb",
    pdfUrl: "/manus-storage/3._Die_Autonomiephase_(fertig)_b707ec61.pdf",
    workbookPages: "S. 9–10",
  },
  {
    num: "04",
    title: "Die Illusion der Wahl",
    desc: "Kinder in der Autonomiephase wollen Kontrolle – und das ist gut so. Darleen zeigt dir, wie du deinem Kind echte Entscheidungsmöglichkeiten gibst, ohne die Führung zu verlieren. Diese einfache Technik reduziert Machtkampfe spürbar und stärkt gleichzeitig die Selbstwirksamkeit deines Kindes.",
    bunnyId: "7d3c3041-4c8a-4098-afd0-a0c573fa9e0e",
    pdfUrl: "/manus-storage/4._Die_Illusion_der_Wahl_(fertig)_9f509a89.pdf",
    workbookPages: "S. 11–13",
  },
  {
    num: "05",
    title: "Das Führungsparadox",
    desc: "Grenzen setzen und gleichzeitig liebevoll sein – geht das? Ja, und es ist sogar notwendig. In dieser Lektion lernst du, warum klare Führung kein Widerspruch zur Bindungsorientierung ist, sondern die Grundlage dafür. Du erfährst, wie du Grenzen so setzt, dass dein Kind sie wirklich annehmen kann.",
    bunnyId: "d7d8b2f6-1796-485a-a6cf-cf753b824437",
    pdfUrl: "/manus-storage/5._Das_Fuhrungsparadox_(fertig)_1eafc149.pdf",
    workbookPages: "S. 14–16",
  },
  {
    num: "06",
    title: "Erste Hilfe bei Wutanfällen",
    desc: "Was tust du, wenn dein Kind gerade mitten im Wutanfall ist? Diese Lektion gibt dir konkrete Strategien für genau diesen Moment. Du lernst, wie du deeskalierst, ohne nachzugeben, wie du die Verbindung hältst und wie du deinem Kind hilfst, sich wieder zu beruhigen.",
    bunnyId: "b24d269a-09bf-4e7d-a068-746722639e5c",
    pdfUrl: "/manus-storage/6._Erste_Hilfe_bei_Wutanfallen_(fertig)_1d990ea9.pdf",
    workbookPages: "S. 17–19",
  },
  {
    num: "07",
    title: "Zen-Mama: Empathie & Gelassenheit",
    desc: "Die größte Herausforderung ist oft nicht das Kind – sondern die eigene Reaktion. In dieser Lektion lernst du, wie du deine eigene Selbstregulation stärkst, Trigger erkennst und in stressigen Momenten ruhig bleibst. Empathie beginnt bei dir selbst.",
    bunnyId: "7d59a256-e4d4-4b2b-bb8d-571851519efd",
    pdfUrl: "/manus-storage/7._Empathie_und_Gelassenheit_(fertig)_b34eba6e.pdf",
    workbookPages: "S. 20–21",
  },
  {
    num: "08",
    title: "Frustrationstoleranz stärken",
    desc: "Kinder, die lernen mit Frust umzugehen, sind langfristig widerstandsfähiger und ausgeglichener. Darleen zeigt dir fünf alltagstaugliche Übungen, die du sofort einsetzen kannst – spielerisch, ohne Druck und mit spürbarer Wirkung auf das Verhalten deines Kindes.",
    bunnyId: "54786fc6-d7bf-4877-b924-620f6194e010",
    pdfUrl: "/manus-storage/8._Ubungen_zur_Starkung_der_Frustrationstoleranz_(fertig)__4b406dc0.pdf",
    workbookPages: "S. 22–24",
  },
  {
    num: "09",
    title: "Wutanfälle in der Öffentlichkeit",
    desc: "Der Wutanfall im Supermarkt, auf dem Spielplatz oder bei Oma – besonders schwierig, wenn alle zuschauen. Diese Lektion gibt dir einen klaren Plan für genau diese Situationen: Wie bleibst du gelassen, wenn du dich beobachtet fühlst? Und wie schützt du dein Kind und dich selbst?",
    bunnyId: "479c1b6c-990e-4071-8722-3c5d73855652",
    pdfUrl: "/manus-storage/9._Wutanfalle_in_der_Offentlichkeit_df4b0416.pdf",
    workbookPages: "S. 25–27",
  },
  {
    num: "10",
    title: "Bindungsorientiert erziehen",
    desc: "Eine sichere Bindung ist das wirksamste Mittel gegen Trotzanfälle – nicht weil sie sie verhindert, sondern weil sie dein Kind stabiler macht. Du lernst, was Bindungsorientierung im Alltag konkret bedeutet, welche kleinen Gesten die größte Wirkung haben und wie du auch nach schwierigen Momenten die Verbindung wiederherstellt.",
    bunnyId: "539d2943-7fc7-4e3b-a3fe-4df03f6efb38",
    pdfUrl: "/manus-storage/10._Bindungsorientiert_(fertig)_42ac071e.pdf",
    workbookPages: "S. 28–30",
  },
  {
    num: "11",
    title: "Abschluss & Ausblick",
    desc: "Du hast es geschafft! In der letzten Lektion fasst Darleen die wichtigsten Erkenntnisse zusammen und gibt dir einen persönlichen Ausblick: Was kommt als nächstes? Wie bleibst du dran? Und was möchte Darleen dir auf den Weg mitgeben – von Mama zu Mama.",
    bunnyId: "605051f1-86ed-44ef-a66c-4f002b95c810",
    pdfUrl: "/manus-storage/11._Mama-Hafen_(fertig)_844234c9.pdf",
    workbookPages: "S. 31–41",
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
  const [descOpen, setDescOpen] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

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

  // Fortschritt laden sobald E-Mail bekannt
  useEffect(() => {
    if (data?.email) {
      setProgress(loadProgress(data.email));
    }
  }, [data?.email]);

  const trackVideoEvent = trpc.course.trackVideoEvent.useMutation();

  const markWatched = (moduleNum: string, percent: number) => {
    if (!data?.email) return;
    const updated = { ...progress, [moduleNum]: percent };
    setProgress(updated);
    saveProgress(data.email, updated);
  };

  // Video-Start tracken wenn Modul gewechselt wird
  const handleModuleSelect = (index: number) => {
    setActiveModule(index);
    setDescOpen(false);
    if (sessionToken && modules[index]) {
      const mod = modules[index];
      const prevProgress = progress[mod.num] ?? 0;
      const eventType = prevProgress > 0 ? "replay" : "start";
      trackVideoEvent.mutate({
        sessionToken,
        videoId: mod.bunnyId,
        videoTitle: mod.title,
        eventType,
      });
    }
  };

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

  // Gesamtfortschritt berechnen
  const totalDone = modules.filter(m => (progress[m.num] ?? 0) >= 100).length;
  const totalPartial = modules.filter(m => { const p = progress[m.num] ?? 0; return p > 0 && p < 100; }).length;
  const overallPercent = Math.round(
    modules.reduce((sum, m) => sum + (progress[m.num] ?? 0), 0) / modules.length
  );

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
          {/* Gesamtfortschritt */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden", padding: "0 0.5rem" }}>
            <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 4, overflow: "hidden", minWidth: 40, maxWidth: 120 }}>
              <div style={{ height: "100%", width: `${overallPercent}%`, background: overallPercent >= 100 ? "#22c55e" : "rgba(255,255,255,0.85)", borderRadius: 4, transition: "width 0.4s" }} />
            </div>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.65rem, 1.8vw, 0.78rem)", whiteSpace: "nowrap", flexShrink: 0 }}>
              {totalDone}/{modules.length}
            </span>
          </div>
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
                {/* Aufklappbare Beschreibung */}
                <div style={{ marginBottom: "1rem" }}>
                  <button
                    onClick={() => setDescOpen((o) => !o)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      color: "var(--teal)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                    }}
                  >
                    <span style={{
                      display: "inline-block",
                      transition: "transform 0.2s",
                      transform: descOpen ? "rotate(90deg)" : "rotate(0deg)",
                      fontSize: "0.7rem",
                    }}>&#9654;</span>
                    Beschreibung
                  </button>
                  {descOpen && (
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.88rem", lineHeight: 1.65, margin: "0.5rem 0 0", paddingLeft: "1.1rem" }}>
                      {currentModule?.desc}
                    </p>
                  )}
                </div>

                {/* Fortschritt-Buttons */}
                <div style={{ marginBottom: "0.8rem" }}>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {[{ label: "Noch nicht gesehen", val: 0 }, { label: "Angefangen", val: 50 }, { label: "✓ Fertig gesehen", val: 100 }].map(({ label, val }) => {
                      const cur = progress[currentModule.num] ?? 0;
                      const isActive = val === 0 ? cur === 0 : val === 50 ? cur > 0 && cur < 100 : cur >= 100;
                      return (
                        <button
                          key={val}
                          onClick={() => markWatched(currentModule.num, val)}
                          style={{
                            background: isActive ? (val >= 100 ? "#22c55e" : val === 50 ? "var(--teal)" : "var(--sand)") : "transparent",
                            color: isActive ? (val === 0 ? "var(--foreground)" : "white") : "var(--muted-foreground)",
                            border: isActive ? "none" : "1px solid var(--border)",
                            borderRadius: 8,
                            padding: "0.35rem 0.75rem",
                            fontSize: "0.78rem",
                            fontWeight: isActive ? 700 : 500,
                            cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            transition: "all 0.15s",
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Workbook-Button mit Seitenangabe */}
                <a
                  href={WORKBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "var(--coral)",
                    color: "white",
                    borderRadius: 10,
                    padding: "0.5rem 1rem",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 2px 10px rgba(232,112,74,0.2)",
                    transition: "background 0.15s, transform 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#c0392b";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--coral)";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "";
                  }}
                >
                  📖 Workbook öffnen
                  {currentModule?.workbookPages && (
                    <span style={{
                      background: "rgba(255,255,255,0.25)",
                      borderRadius: 6,
                      padding: "0.1rem 0.45rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginLeft: "0.2rem",
                    }}>
                      {currentModule.workbookPages}
                    </span>
                  )}
                </a>
              </div>
            </div>
          </div>

          {/* Modulliste */}
          <div style={{ minWidth: 0, width: "100%" }}>
            <h3
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "0.95rem",
                marginBottom: "0.5rem",
                color: "var(--foreground)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                opacity: 0.6,
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
                  onClick={() => handleModuleSelect(i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.55rem 0.8rem",
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
                    {/* Fortschrittsbalken */}
                    <div style={{ marginTop: "0.25rem", height: 4, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${progress[m.num] ?? 0}%`,
                          background: (progress[m.num] ?? 0) >= 100 ? "#22c55e" : "var(--teal)",
                          borderRadius: 4,
                          transition: "width 0.4s ease",
                        }}
                      />
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
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.76rem", margin: 0, lineHeight: 1.8 }}>
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
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginTop: "0.5rem" }}>
            Fragen oder Probleme?{" "}
            <a
              href="mailto:info@darvismedia.de"
              style={{
                color: "rgba(255,255,255,0.85)",
                fontWeight: 700,
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              info@darvismedia.de
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
