/**
 * Mama-Hafen Admin-Dashboard
 * Nur für eingeloggte Admins (Manus OAuth)
 * Zeigt: Käuferliste, Traffic-Quellen, Video-Statistiken
 */

import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

const SOURCE_LABELS: Record<string, string> = {
  instagram: "Instagram",
  google: "Google",
  youtube: "YouTube",
  pinterest: "Pinterest",
  facebook: "Facebook",
  "": "Direkt / Unbekannt",
};

const SOURCE_COLORS: Record<string, string> = {
  instagram: "#E1306C",
  google: "#4285F4",
  youtube: "#FF0000",
  pinterest: "#E60023",
  facebook: "#1877F2",
  "": "#6B7280",
};

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      padding: "1.5rem",
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      borderTop: `4px solid ${color || "var(--teal)"}`,
    }}>
      <div style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>{label}</div>
      <div style={{ fontSize: "2.2rem", fontWeight: 800, color: color || "var(--teal)", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.4rem" }}>{sub}</div>}
    </div>
  );
}

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data, isLoading, error } = trpc.course.getAdminStats.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || isLoading) {
    return (
      <div style={{
        minHeight: "100svh", background: "var(--cream)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
          <p style={{ color: "var(--muted-foreground)" }}>Dashboard wird geladen…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100svh", background: "var(--cream)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
          <p style={{ color: "var(--muted-foreground)" }}>Kein Zugriff auf das Admin-Dashboard.</p>
          <a href="/" style={{ color: "var(--teal)", fontWeight: 700 }}>← Zurück zur Startseite</a>
        </div>
      </div>
    );
  }

  const buyers = data?.buyers ?? [];
  const videoStarts = data?.videoStarts ?? [];
  const videoReplays = data?.videoReplays ?? [];
  const trafficSources = data?.trafficSources ?? [];

  const totalRevenue = buyers.length * 99;

  // Traffic-Quellen für Balkendiagramm
  const maxSourceCount = Math.max(...trafficSources.map(s => Number(s.count)), 1);

  // Top-Video nach Starts
  const topVideo = videoStarts[0];

  return (
    <div style={{
      minHeight: "100svh",
      background: "var(--cream)",
      fontFamily: "'DM Sans', sans-serif",
      color: "var(--foreground)",
    }}>
      {/* Header */}
      <header style={{
        background: "var(--teal)",
        padding: "1rem 0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "white",
            }}>⚓ Mama-Hafen</span>
            <span style={{
              marginLeft: "0.75rem",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0.2rem 0.6rem",
              borderRadius: 50,
            }}>Admin</span>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem" }}>{user?.name}</span>
            <a href="/" style={{
              color: "white",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
              background: "rgba(255,255,255,0.15)",
              padding: "0.4rem 0.9rem",
              borderRadius: 50,
              border: "1px solid rgba(255,255,255,0.3)",
            }}>← Website</a>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "2rem 1rem", maxWidth: 1100, margin: "0 auto" }}>
        {/* Titel */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            color: "var(--teal)",
            marginBottom: "0.3rem",
          }}>Dashboard</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
            Übersicht über Käufer, Traffic-Quellen und Video-Nutzung
          </p>
        </div>

        {/* KPI-Karten */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}>
          <StatCard label="Käufer gesamt" value={buyers.length} sub="aktive Zugänge" color="var(--teal)" />
          <StatCard label="Umsatz (geschätzt)" value={`${totalRevenue} €`} sub="à 99 € pro Kurs" color="#10b981" />
          <StatCard label="Video-Starts" value={videoStarts.reduce((s, v) => s + Number(v.count), 0)} sub="gesamt alle Module" color="var(--coral)" />
          <StatCard label="Beliebtestes Video" value={topVideo ? `#${topVideo.videoId.slice(0, 4)}…` : "–"} sub={topVideo?.videoTitle ?? "noch keine Daten"} color="#8b5cf6" />
        </div>

        {/* 2-Spalten-Layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}>
          {/* Traffic-Quellen */}
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "1.5rem",
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.1rem",
              color: "var(--teal)",
              marginBottom: "1.2rem",
            }}>📊 Traffic-Quellen</h2>
            {trafficSources.length === 0 ? (
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Noch keine Daten vorhanden.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {trafficSources.map((s) => {
                  const label = SOURCE_LABELS[s.utmSource ?? ""] ?? s.utmSource ?? "Direkt";
                  const color = SOURCE_COLORS[s.utmSource ?? ""] ?? "#6B7280";
                  const pct = Math.round((Number(s.count) / maxSourceCount) * 100);
                  return (
                    <div key={s.utmSource ?? "direct"}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{label}</span>
                        <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>{s.count} Käufer</span>
                      </div>
                      <div style={{ background: "#f3f4f6", borderRadius: 50, height: 8, overflow: "hidden" }}>
                        <div style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: color,
                          borderRadius: 50,
                          transition: "width 0.5s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Video-Starts */}
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "1.5rem",
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.1rem",
              color: "var(--teal)",
              marginBottom: "1.2rem",
            }}>▶️ Video-Starts</h2>
            {videoStarts.length === 0 ? (
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Noch keine Video-Daten vorhanden.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {videoStarts.map((v) => {
                  const replay = videoReplays.find(r => r.videoId === v.videoId);
                  return (
                    <div key={v.videoId} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.6rem 0.8rem",
                      background: "#f9fafb",
                      borderRadius: 10,
                      fontSize: "0.85rem",
                    }}>
                      <span style={{ fontWeight: 600, flex: 1, marginRight: "0.5rem" }}>{v.videoTitle}</span>
                      <div style={{ display: "flex", gap: "0.6rem", flexShrink: 0 }}>
                        <span style={{
                          background: "rgba(20,100,90,0.1)",
                          color: "var(--teal)",
                          fontWeight: 700,
                          padding: "0.2rem 0.6rem",
                          borderRadius: 50,
                          fontSize: "0.78rem",
                        }}>▶ {v.count}×</span>
                        {replay && (
                          <span style={{
                            background: "rgba(230,80,50,0.1)",
                            color: "var(--coral)",
                            fontWeight: 700,
                            padding: "0.2rem 0.6rem",
                            borderRadius: 50,
                            fontSize: "0.78rem",
                          }}>↺ {replay.count}×</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Käuferliste */}
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: "1.5rem",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1.1rem",
            color: "var(--teal)",
            marginBottom: "1.2rem",
          }}>👥 Käuferliste</h2>
          {buyers.length === 0 ? (
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Noch keine Käufer vorhanden.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                    {["E-Mail", "Kaufdatum", "Quelle", "Kampagne", "Letzter Login"].map(h => (
                      <th key={h} style={{
                        textAlign: "left",
                        padding: "0.6rem 0.8rem",
                        fontWeight: 700,
                        color: "var(--muted-foreground)",
                        fontSize: "0.75rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {buyers.map((b, i) => {
                    const source = b.utmSource || "";
                    const sourceLabel = SOURCE_LABELS[source] ?? source;
                    const sourceColor = SOURCE_COLORS[source] ?? "#6B7280";
                    return (
                      <tr key={b.email} style={{
                        borderBottom: "1px solid #f3f4f6",
                        background: i % 2 === 0 ? "white" : "#fafafa",
                      }}>
                        <td style={{ padding: "0.7rem 0.8rem", fontWeight: 600 }}>{b.email}</td>
                        <td style={{ padding: "0.7rem 0.8rem", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>
                          {b.grantedAt ? new Date(b.grantedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) : "–"}
                        </td>
                        <td style={{ padding: "0.7rem 0.8rem" }}>
                          <span style={{
                            background: `${sourceColor}18`,
                            color: sourceColor,
                            fontWeight: 700,
                            padding: "0.2rem 0.7rem",
                            borderRadius: 50,
                            fontSize: "0.78rem",
                            whiteSpace: "nowrap",
                          }}>{sourceLabel}</span>
                        </td>
                        <td style={{ padding: "0.7rem 0.8rem", color: "var(--muted-foreground)" }}>
                          {b.utmCampaign || "–"}
                        </td>
                        <td style={{ padding: "0.7rem 0.8rem", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>
                          {b.lastLoginAt ? new Date(b.lastLoginAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) : "–"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
