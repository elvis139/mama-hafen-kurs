/**
 * Mama-Hafen Admin-Dashboard
 * Tabs: Dashboard (Statistiken) | Zugangsverwaltung (Einzel + CSV)
 */

import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect, useMemo, useRef, useState } from "react";

const SOURCE_LABELS: Record<string, string> = {
  instagram: "Instagram",
  google: "Google",
  youtube: "YouTube",
  pinterest: "Pinterest",
  facebook: "Facebook",
  manual: "Manuell (Admin)",
  "": "Direkt / Unbekannt",
};

const SOURCE_COLORS: Record<string, string> = {
  instagram: "#E1306C",
  google: "#4285F4",
  youtube: "#FF0000",
  pinterest: "#E60023",
  facebook: "#1877F2",
  manual: "#6366f1",
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

// ── Hilfsfunktion: CSV parsen ─────────────────────────────────────────────────
function parseEmailsFromCsv(text: string): string[] {
  const lines = text.split(/[\r\n,;]+/);
  const emails: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim().toLowerCase();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      emails.push(trimmed);
    }
  }
  return Array.from(new Set(emails)); // Duplikate entfernen
}

// ── Zugangsverwaltungs-Tab ────────────────────────────────────────────────────
function AccessManagement({ sessionToken }: { sessionToken: string }) {
  const utils = trpc.useUtils();

  // Alle Zugänge laden (inkl. deaktivierter)
  const { data: allAccess, isLoading: loadingAll, refetch } = trpc.course.getAllAccess.useQuery(
    { sessionToken },
    { enabled: !!sessionToken, retry: false }
  );

  // Einzel-Anlage
  const [singleEmail, setSingleEmail] = useState("");
  const [singleMsg, setSingleMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const addSingle = trpc.course.addSingleAccess.useMutation({
    onSuccess: (data) => {
      setSingleMsg({ type: "success", text: `✅ Zugang für ${data.email} erfolgreich angelegt.` });
      setSingleEmail("");
      refetch();
    },
    onError: (err) => {
      setSingleMsg({ type: "error", text: `❌ Fehler: ${err.message}` });
    },
  });

  // CSV-Import
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvEmails, setCsvEmails] = useState<string[]>([]);
  const [csvFileName, setCsvFileName] = useState("");
  const [bulkMsg, setBulkMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const addBulk = trpc.course.addBulkAccess.useMutation({
    onSuccess: (data) => {
      setBulkMsg({ type: "success", text: `✅ ${data.added} Zugänge angelegt${data.errors > 0 ? `, ${data.errors} Fehler` : ""}.` });
      setCsvEmails([]);
      setCsvFileName("");
      refetch();
    },
    onError: (err) => {
      setBulkMsg({ type: "error", text: `❌ Fehler: ${err.message}` });
    },
  });

  // Toggle Zugang
  const toggleAccess = trpc.course.toggleAccess.useMutation({
    onSuccess: () => refetch(),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const emails = parseEmailsFromCsv(text);
      setCsvEmails(emails);
      setBulkMsg(null);
    };
    reader.readAsText(file);
  };

  const allList = allAccess ?? [];
  const activeCount = allList.filter(a => a.isActive).length;
  const inactiveCount = allList.filter(a => !a.isActive).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Einzel-Anlage */}
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: "1.5rem",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "var(--teal)", marginBottom: "0.3rem" }}>
          ✉️ Einzelnen Zugang anlegen
        </h2>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", marginBottom: "1.2rem" }}>
          Für Käufer, die den Kurs bereits bezahlt haben (z.B. per Überweisung oder früherem Kauf).
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <input
            type="email"
            value={singleEmail}
            onChange={e => { setSingleEmail(e.target.value); setSingleMsg(null); }}
            placeholder="name@beispiel.de"
            style={{
              flex: 1,
              minWidth: 220,
              padding: "0.65rem 1rem",
              border: "1.5px solid var(--border)",
              borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              outline: "none",
              background: "var(--cream)",
            }}
            onKeyDown={e => {
              if (e.key === "Enter" && singleEmail.trim()) {
                addSingle.mutate({ sessionToken, email: singleEmail.trim() });
              }
            }}
          />
          <button
            onClick={() => {
              if (singleEmail.trim()) {
                addSingle.mutate({ sessionToken, email: singleEmail.trim() });
              }
            }}
            disabled={!singleEmail.trim() || addSingle.isPending}
            style={{
              background: addSingle.isPending ? "#9ca3af" : "var(--teal)",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "0.65rem 1.4rem",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: addSingle.isPending ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {addSingle.isPending ? "Wird angelegt…" : "Zugang gewähren"}
          </button>
        </div>
        {singleMsg && (
          <div style={{
            marginTop: "0.75rem",
            padding: "0.65rem 1rem",
            borderRadius: 10,
            background: singleMsg.type === "success" ? "#d1fae5" : "#fee2e2",
            color: singleMsg.type === "success" ? "#065f46" : "#991b1b",
            fontSize: "0.88rem",
            fontWeight: 600,
          }}>{singleMsg.text}</div>
        )}
      </div>

      {/* CSV-Import */}
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: "1.5rem",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "var(--teal)", marginBottom: "0.3rem" }}>
          📋 CSV-Import (Bulk)
        </h2>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", marginBottom: "1.2rem" }}>
          Lade eine CSV-Datei hoch (eine E-Mail pro Zeile, oder kommagetrennt). Bis zu 500 E-Mails auf einmal.
        </p>

        {/* Upload-Bereich */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: "2px dashed var(--border)",
            borderRadius: 12,
            padding: "1.5rem",
            textAlign: "center",
            cursor: "pointer",
            background: "var(--cream)",
            transition: "border-color 0.2s",
            marginBottom: "1rem",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--teal)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📁</div>
          <p style={{ fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
            {csvFileName ? csvFileName : "CSV-Datei auswählen"}
          </p>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.82rem" }}>
            Klicken zum Hochladen · .csv, .txt
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Vorschau */}
        {csvEmails.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}>
              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                {csvEmails.length} E-Mail{csvEmails.length !== 1 ? "s" : ""} erkannt:
              </span>
              <button
                onClick={() => { setCsvEmails([]); setCsvFileName(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                style={{ background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer", fontSize: "0.82rem" }}
              >
                ✕ Zurücksetzen
              </button>
            </div>
            <div style={{
              background: "#f9fafb",
              borderRadius: 10,
              padding: "0.75rem 1rem",
              maxHeight: 160,
              overflowY: "auto",
              fontSize: "0.82rem",
              lineHeight: 1.8,
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            }}>
              {csvEmails.slice(0, 20).map(e => <div key={e}>{e}</div>)}
              {csvEmails.length > 20 && (
                <div style={{ color: "var(--muted-foreground)", fontStyle: "italic" }}>
                  … und {csvEmails.length - 20} weitere
                </div>
              )}
            </div>
            <button
              onClick={() => addBulk.mutate({ sessionToken, emails: csvEmails })}
              disabled={addBulk.isPending}
              style={{
                marginTop: "0.75rem",
                background: addBulk.isPending ? "#9ca3af" : "var(--teal)",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "0.65rem 1.4rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: addBulk.isPending ? "not-allowed" : "pointer",
              }}
            >
              {addBulk.isPending ? `Wird importiert…` : `${csvEmails.length} Zugänge anlegen`}
            </button>
          </div>
        )}

        {bulkMsg && (
          <div style={{
            padding: "0.65rem 1rem",
            borderRadius: 10,
            background: bulkMsg.type === "success" ? "#d1fae5" : "#fee2e2",
            color: bulkMsg.type === "success" ? "#065f46" : "#991b1b",
            fontSize: "0.88rem",
            fontWeight: 600,
          }}>{bulkMsg.text}</div>
        )}
      </div>

      {/* Alle Zugänge */}
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: "1.5rem",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "var(--teal)", margin: 0 }}>
            👥 Alle Zugänge ({allList.length})
          </h2>
          <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem" }}>
            <span style={{ background: "#d1fae5", color: "#065f46", padding: "0.2rem 0.7rem", borderRadius: 50, fontWeight: 700 }}>
              ✓ {activeCount} aktiv
            </span>
            {inactiveCount > 0 && (
              <span style={{ background: "#fee2e2", color: "#991b1b", padding: "0.2rem 0.7rem", borderRadius: 50, fontWeight: 700 }}>
                ✗ {inactiveCount} deaktiviert
              </span>
            )}
          </div>
        </div>

        {loadingAll ? (
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Wird geladen…</p>
        ) : allList.length === 0 ? (
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Noch keine Zugänge vorhanden.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                  {["E-Mail", "Angelegt am", "Quelle", "Status", "Aktion"].map(h => (
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
                {allList.map((a, i) => {
                  const source = a.utmSource || "";
                  const sourceLabel = SOURCE_LABELS[source] ?? source;
                  const sourceColor = SOURCE_COLORS[source] ?? "#6B7280";
                  return (
                    <tr key={a.email} style={{
                      borderBottom: "1px solid #f3f4f6",
                      background: i % 2 === 0 ? "white" : "#fafafa",
                      opacity: a.isActive ? 1 : 0.6,
                    }}>
                      <td style={{ padding: "0.7rem 0.8rem", fontWeight: 600 }}>{a.email}</td>
                      <td style={{ padding: "0.7rem 0.8rem", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>
                        {a.grantedAt ? new Date(a.grantedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) : "–"}
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
                      <td style={{ padding: "0.7rem 0.8rem" }}>
                        <span style={{
                          background: a.isActive ? "#d1fae5" : "#fee2e2",
                          color: a.isActive ? "#065f46" : "#991b1b",
                          fontWeight: 700,
                          padding: "0.2rem 0.7rem",
                          borderRadius: 50,
                          fontSize: "0.78rem",
                        }}>{a.isActive ? "Aktiv" : "Deaktiviert"}</span>
                      </td>
                      <td style={{ padding: "0.7rem 0.8rem" }}>
                        <button
                          onClick={() => toggleAccess.mutate({ sessionToken, email: a.email, isActive: !a.isActive })}
                          disabled={toggleAccess.isPending}
                          style={{
                            background: a.isActive ? "#fee2e2" : "#d1fae5",
                            color: a.isActive ? "#991b1b" : "#065f46",
                            border: "none",
                            borderRadius: 8,
                            padding: "0.3rem 0.75rem",
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            cursor: toggleAccess.isPending ? "not-allowed" : "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {a.isActive ? "Deaktivieren" : "Reaktivieren"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Community-Fragen-Ansicht ──────────────────────────────────────────────
function QuestionsView({ sessionToken }: { sessionToken: string }) {
  const { data, isLoading, error } = trpc.course.getQuestions.useQuery(
    { sessionToken },
    { enabled: !!sessionToken, retry: false }
  );

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⏳</div>
        Fragen werden geladen…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#ef4444" }}>
        Fehler beim Laden der Fragen: {error.message}
      </div>
    );
  }

  const questions = data ?? [];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", color: "var(--teal)", margin: 0 }}>
          ❓ Community-Fragen
        </h2>
        <span style={{
          background: "var(--teal)",
          color: "white",
          borderRadius: 50,
          padding: "0.2rem 0.75rem",
          fontSize: "0.8rem",
          fontWeight: 700,
        }}>{questions.length} Fragen</span>
      </div>

      {questions.length === 0 ? (
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: "3rem",
          textAlign: "center",
          boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⚓</div>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>Noch keine Fragen eingegangen.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {questions.map((q) => (
            <div
              key={q.id}
              style={{
                background: "white",
                borderRadius: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                padding: "1.2rem 1.4rem",
                borderLeft: "4px solid var(--teal)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>{q.userEmail}</span>
                  {q.userName && q.userName !== q.userEmail && (
                    <span style={{ marginLeft: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.82rem" }}>({q.userName})</span>
                  )}
                </div>
                <span style={{ color: "var(--muted-foreground)", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                  {q.createdAt ? new Date(q.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " Uhr" : "–"}
                </span>
              </div>
              <p style={{
                color: "var(--foreground)",
                fontSize: "0.9rem",
                lineHeight: 1.65,
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>{q.question}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Haupt-Komponente ──────────────────────────────────────────────
export default function Admin() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"dashboard" | "access" | "questions">("dashboard");

  const sessionToken = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mama_hafen_session") ?? "";
    }
    return "";
  }, []);

  const { data, isLoading, error } = trpc.course.getAdminStats.useQuery(
    { sessionToken },
    { enabled: !!sessionToken, retry: false }
  );

  useEffect(() => {
    if (!sessionToken) {
      navigate("/kurs/login");
    }
  }, [sessionToken, navigate]);

  if (isLoading) {
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
  const maxSourceCount = Math.max(...trafficSources.map(s => Number(s.count)), 1);
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
            <a href="/kurs" style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}>Kursbereich</a>
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
        <div style={{ marginBottom: "1.5rem" }}>
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

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          borderBottom: "2px solid var(--border)",
          paddingBottom: 0,
        }}>
          {([
            { id: "dashboard", label: "📊 Statistiken" },
            { id: "access", label: "🔑 Zugangsverwaltung" },
            { id: "questions", label: "❓ Community-Fragen" },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? "3px solid var(--teal)" : "3px solid transparent",
                padding: "0.6rem 1.2rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: "0.95rem",
                color: activeTab === tab.id ? "var(--teal)" : "var(--muted-foreground)",
                cursor: "pointer",
                transition: "all 0.2s",
                marginBottom: "-2px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab-Inhalte */}
        {activeTab === "dashboard" && (
          <>
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
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "var(--teal)", marginBottom: "1.2rem" }}>
                  📊 Traffic-Quellen
                </h2>
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
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "var(--teal)", marginBottom: "1.2rem" }}>
                  ▶️ Video-Starts
                </h2>
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
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "var(--teal)", marginBottom: "1.2rem" }}>
                👥 Käuferliste
              </h2>
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
          </>
        )}

        {activeTab === "access" && (
          <AccessManagement sessionToken={sessionToken} />
        )}

        {activeTab === "questions" && (
          <QuestionsView sessionToken={sessionToken} />
        )}
      </main>
    </div>
  );
}
