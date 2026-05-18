import Layout from "@/components/Layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useReport } from "@/hooks/useReport";
import { useSession } from "@/hooks/useSession";
import { useState, useRef, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

// ─── API Base (adjust to your env) ───────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL ?? "";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const scoreColor = (score) => {
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#f59e0b";
  if (score >= 50) return "#f97316";
  return "#ef4444";
};

const avgScore = (attempts) =>
  attempts?.length
    ? Math.round(
        attempts.reduce((s, a) => s + a.quality_score, 0) / attempts.length,
      )
    : 0;

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const RATING_META = {
  excellent: {
    label: "Excellent",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
  },
  good: {
    label: "Good",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
  },
  developing: {
    label: "Developing",
    color: "#f97316",
    bg: "rgba(249,115,22,0.1)",
    border: "rgba(249,115,22,0.3)",
  },
  needs_support: {
    label: "Needs Support",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
  },
};

const STATUS_META = {
  mastered: { color: "#10b981", label: "Mastered" },
  improving: { color: "#f59e0b", label: "Improving" },
  needs_practice: { color: "#f97316", label: "Needs Practice" },
  struggling: { color: "#ef4444", label: "Struggling" },
};

// ─── ScoreRing ────────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 50, stroke = 4 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={color}
        fontSize={size * 0.28}
        fontWeight="700"
        style={{
          transform: "rotate(90deg)",
          transformOrigin: "center",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {score}
      </text>
    </svg>
  );
}

// ─── QualityBadge ─────────────────────────────────────────────────────────────
function QualityBadge({ cls }) {
  const styles = {
    Excellent: {
      background: "rgba(52,211,153,0.15)",
      color: "#0d9488",
      border: "1px solid rgba(52,211,153,0.35)",
    },
    Good: {
      background: "rgba(251,191,36,0.12)",
      color: "#d97706",
      border: "1px solid rgba(251,191,36,0.3)",
    },
    "Needs Practice": {
      background: "rgba(249,115,22,0.12)",
      color: "#ea580c",
      border: "1px solid rgba(249,115,22,0.3)",
    },
  };
  const s = styles[cls] || styles["Good"];
  return (
    <span
      style={{
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 99,
        fontWeight: 600,
        ...s,
      }}
    >
      {cls}
    </span>
  );
}

// ─── PhoneBar ─────────────────────────────────────────────────────────────────
function PhoneBar({ phone, score, soundMostLike }) {
  const color = scoreColor(score);
  const match = phone === soundMostLike;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 0",
      }}
    >
      <div
        style={{
          width: 34,
          textAlign: "center",
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          fontWeight: 600,
          color: "#94a3b8",
          background: "#f1f5f9",
          borderRadius: 5,
          padding: "2px 3px",
        }}
      >
        /{phone}/
      </div>
      <div
        style={{
          flex: 1,
          height: 7,
          background: "#f1f5f9",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            background: color,
            borderRadius: 99,
            transition: "width 0.7s ease",
          }}
        />
      </div>
      <div
        style={{
          width: 28,
          textAlign: "right",
          fontSize: 12,
          fontWeight: 700,
          color,
        }}
      >
        {Math.round(score)}
      </div>
      {!match && (
        <div
          style={{
            fontSize: 10,
            color: "#94a3b8",
            background: "#f1f5f9",
            borderRadius: 4,
            padding: "1px 5px",
            whiteSpace: "nowrap",
          }}
        >
          ≈ /{soundMostLike}/
        </div>
      )}
    </div>
  );
}

// ─── AttemptCard ──────────────────────────────────────────────────────────────
function AttemptCard({ attempt, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{
        background: "#fafafa",
        border: "1px solid #f1f5f9",
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#f1f5f9")}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#7c3aed",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </div>
        <ScoreRing score={attempt.quality_score} size={44} stroke={3.5} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 2,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              Attempt {index + 1}
            </span>
            <QualityBadge cls={attempt.quality_class} />
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            {formatDate(attempt.createdAt)}
          </div>
        </div>
        <div
          style={{
            color: "#94a3b8",
            fontSize: 16,
            transition: "transform 0.2s",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid #f1f5f9" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: "10px 0 8px",
            }}
          >
            Phoneme Breakdown
          </div>
          {attempt.phone_score_list.map((p, i) => (
            <PhoneBar
              key={i}
              phone={p.phone}
              score={p.quality_score}
              soundMostLike={p.sound_most_like}
            />
          ))}
          {attempt.llmFeedback && (
            <div
              style={{
                marginTop: 12,
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.18)",
                borderRadius: 9,
                padding: "11px 12px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#7c3aed",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                AI Feedback
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "#475569",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {attempt.llmFeedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const score = payload[0].value;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "8px 12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>
        Attempt {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: scoreColor(score) }}>
        {score}
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8" }}>/ 100</div>
    </div>
  );
}

// ─── Report Modal ─────────────────────────────────────────────────────────────
function ReportModal({ report, session, onClose }) {
  const printRef = useRef(null);

  const handleDownloadPDF = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank", "width=800,height=900");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report – ${report.word}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', sans-serif; color: #0f172a; background: #fff; padding: 40px; }
          h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
          h2 { font-size: 14px; font-weight: 700; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.08em; margin: 24px 0 10px; }
          p  { font-size: 14px; line-height: 1.7; color: #475569; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0; }
          .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center; }
          .card .val { font-size: 24px; font-weight: 800; }
          .card .lbl { font-size: 11px; color: #94a3b8; margin-top: 4px; }
          ul { padding-left: 18px; }
          li { font-size: 14px; color: #475569; margin-bottom: 6px; line-height: 1.5; }
          .encourage { background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.2); border-radius: 10px; padding: 14px 16px; margin-top: 12px; }
          .footer { margin-top: 32px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px; }
          .timeline { display: flex; align-items: flex-end; gap: 8px; height: 80px; margin: 12px 0; }
          .bar { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; }
          .bar-fill { width: 100%; border-radius: 4px 4px 0 0; }
          .bar-lbl { font-size: 10px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
          <span style="font-size:11px;color:#7c3aed;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Progress Report</span>
        </div>
        <h1>"${report.word}"</h1>
        <p style="color:#94a3b8;font-size:13px;margin-top:4px">Generated ${formatDate(report.generatedAt)}</p>

        <h2>Summary</h2>
        <div class="grid">
          <div class="card"><div class="val">${report.metrics.averageScore}</div><div class="lbl">Avg Score</div></div>
          <div class="card"><div class="val">${report.metrics.bestScore}</div><div class="lbl">Best Score</div></div>
          <div class="card"><div class="val">${report.metrics.totalAttempts}</div><div class="lbl">Attempts</div></div>
        </div>

        <h2>Score Timeline</h2>
        <div class="timeline">
          ${report.attemptTimeline
            .map((a) => {
              const h = Math.round((a.qualityScore / 100) * 64);
              return `<div class="bar">
              <div style="font-size:11px;font-weight:700;color:${scoreColor(a.qualityScore)}">${a.qualityScore}</div>
              <div class="bar-fill" style="height:${h}px;background:${scoreColor(a.qualityScore)};opacity:0.85;min-height:4px"></div>
              <div class="bar-lbl">#${a.attemptNumber}</div>
            </div>`;
            })
            .join("")}
        </div>

        <h2>Overall Feedback</h2>
        <p>${report.llmReport.overallFeedback}</p>

        <h2>Strengths</h2>
        <ul>${report.llmReport.strengths.map((s) => `<li>${s}</li>`).join("")}</ul>

        <h2>Areas to Improve</h2>
        <ul>${report.llmReport.areasToImprove.map((s) => `<li>${s}</li>`).join("")}</ul>

        <h2>Practice Exercises</h2>
        <ul>${report.llmReport.practiceExercises.map((s) => `<li>${s}</li>`).join("")}</ul>

        ${report.llmReport.therapistNotes ? `<h2>Therapist Notes</h2><p>${report.llmReport.therapistNotes}</p>` : ""}

        <h2>Message for ${report.word} Star ⭐</h2>
        <div class="encourage"><p>${report.llmReport.encouragement}</p></div>

        <div class="footer">Speech Therapy Progress Report · ${new Date().getFullYear()}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 600);
  };

  if (!report) return null;
  const rating = RATING_META[report.overallRating] ?? RATING_META.good;

  // Chart data
  const chartData = report.attemptTimeline.map((a) => ({
    name: `#${a.attemptNumber}`,
    score: a.qualityScore,
  }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 640,
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          overflow: "hidden",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: "22px 24px 16px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#7c3aed",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Progress Report
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              "{report.word}"
            </div>
            <div
              style={{
                marginTop: 6,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: rating.bg,
                border: `1px solid ${rating.border}`,
                borderRadius: 99,
                padding: "3px 10px",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: rating.color,
                }}
              />
              <span
                style={{ fontSize: 11, fontWeight: 700, color: rating.color }}
              >
                {rating.label}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <button
              onClick={handleDownloadPDF}
              style={{
                padding: "8px 14px",
                borderRadius: 9,
                fontSize: 12,
                fontWeight: 600,
                background: "linear-gradient(135deg, #8b5cf6, #9333ea)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              ⬇ Download PDF
            </button>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#64748b",
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* ── Printable body ── */}
        <div ref={printRef} style={{ padding: "20px 24px" }}>
          {/* Summary grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              marginBottom: 22,
            }}
          >
            {[
              {
                emoji: "📊",
                label: "Avg Score",
                value: report.metrics.averageScore,
              },
              {
                emoji: "🏆",
                label: "Best Score",
                value: report.metrics.bestScore,
              },
              {
                emoji: "🔄",
                label: "Attempts",
                value: report.metrics.totalAttempts,
              },
              {
                emoji: "📈",
                label: "Progress",
                value: `${report.metrics.overallProgress >= 0 ? "+" : ""}${report.metrics.overallProgress}`,
              },
              {
                emoji: "🎯",
                label: "Consistency",
                value: report.metrics.consistencyScore,
              },
              {
                emoji: "✅",
                label: "Mastered",
                value: `${report.metrics.masteredPhonemes} phones`,
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "#fafafa",
                  border: "1px solid #f1f5f9",
                  borderRadius: 12,
                  padding: "14px 10px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.emoji}</div>
                <div
                  style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Chart */}
          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94a3b8",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Score Progression
            </div>
            <div
              style={{
                background: "#fafafa",
                border: "1px solid #f1f5f9",
                borderRadius: 12,
                padding: "16px 8px 8px",
              }}
            >
              <ResponsiveContainer width="100%" height={160}>
                <LineChart
                  data={chartData}
                  margin={{ top: 4, right: 16, bottom: 0, left: -24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine
                    y={85}
                    stroke="#10b981"
                    strokeDasharray="4 3"
                    strokeWidth={1.5}
                    label={{
                      value: "85 – Target",
                      position: "right",
                      fontSize: 10,
                      fill: "#10b981",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      const c = scoreColor(payload.score);
                      return (
                        <circle
                          key={cx}
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={c}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      );
                    }}
                    activeDot={{
                      r: 7,
                      fill: "#8b5cf6",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Phoneme Breakdown */}
          {report.phonemeBreakdown?.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Phoneme Analysis
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {report.phonemeBreakdown.map((p, i) => {
                  const st =
                    STATUS_META[p.status] ?? STATUS_META.needs_practice;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "#fafafa",
                        border: "1px solid #f1f5f9",
                        borderRadius: 10,
                        padding: "9px 12px",
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#94a3b8",
                          background: "#f1f5f9",
                          borderRadius: 5,
                          padding: "2px 4px",
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                      >
                        /{p.phone}/
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            height: 6,
                            background: "#f1f5f9",
                            borderRadius: 99,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${p.avgScore}%`,
                              background: scoreColor(p.avgScore),
                              borderRadius: 99,
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: scoreColor(p.avgScore),
                          width: 28,
                          textAlign: "right",
                        }}
                      >
                        {p.avgScore}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 7px",
                            borderRadius: 99,
                            fontWeight: 600,
                            color: st.color,
                            background: `${st.color}18`,
                            border: `1px solid ${st.color}44`,
                          }}
                        >
                          {st.label}
                        </span>
                        {p.trend !== 0 && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: p.trend > 0 ? "#10b981" : "#ef4444",
                            }}
                          >
                            {p.trend > 0 ? "▲" : "▼"}
                            {Math.abs(p.trend)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LLM Sections */}
          {report.llmReport?.overallFeedback && (
            <Section title="Overall Feedback" emoji="💬">
              <p
                style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {report.llmReport.overallFeedback}
              </p>
            </Section>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              margin: "16px 0",
            }}
          >
            {report.llmReport?.strengths?.length > 0 && (
              <BulletSection
                title="Strengths"
                emoji="💪"
                items={report.llmReport.strengths}
                color="#10b981"
              />
            )}
            {report.llmReport?.areasToImprove?.length > 0 && (
              <BulletSection
                title="Areas to Improve"
                emoji="🎯"
                items={report.llmReport.areasToImprove}
                color="#f59e0b"
              />
            )}
          </div>

          {report.llmReport?.practiceExercises?.length > 0 && (
            <BulletSection
              title="Practice Exercises"
              emoji="🏋️"
              items={report.llmReport.practiceExercises}
              color="#8b5cf6"
            />
          )}

          {report.llmReport?.therapistNotes && (
            <Section title="Therapist Notes" emoji="🩺">
              <p
                style={{
                  fontSize: 13,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {report.llmReport.therapistNotes}
              </p>
            </Section>
          )}

          {report.llmReport?.encouragement && (
            <div
              style={{
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: 12,
                padding: "16px 18px",
                marginTop: 16,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#7c3aed",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ⭐ Message for the Child
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {report.llmReport.encouragement}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "0 24px 20px",
            textAlign: "center",
            fontSize: 12,
            color: "#94a3b8",
          }}
        >
          Generated on {formatDate(report.generatedAt)}
        </div>
      </div>
    </div>
  );
}

// ── Small layout helpers used in ReportModal ──────────────────────────────────
function Section({ title, emoji, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {emoji} {title}
      </div>
      <div
        style={{
          background: "#fafafa",
          border: "1px solid #f1f5f9",
          borderRadius: 12,
          padding: "14px 16px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function BulletSection({ title, emoji, items, color }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {emoji} {title}
      </div>
      <div
        style={{
          background: "#fafafa",
          border: "1px solid #f1f5f9",
          borderRadius: 12,
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
                marginTop: 5,
              }}
            />
            <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WordCard ─────────────────────────────────────────────────────────────────
function WordCard({ session, onGenerate, onViewReport }) {
  const [expanded, setExpanded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [hasReport, setHasReport] = useState(session.hasReport);

  const best = session.attempts.reduce(
    (b, a) => (a.quality_score > b ? a.quality_score : b),
    0,
  );
  const latest = session.attempts.at(-1)?.quality_score ?? 0;
  const av = avgScore(session.attempts);
  const trend =
    session.attempts.length > 1
      ? session.attempts.at(-1).quality_score -
        session.attempts[0].quality_score
      : 0;
  const trendStr = trend >= 0 ? `+${trend}` : String(trend);
  const trendColor = trend >= 0 ? "#10b981" : "#ef4444";

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await onGenerate(session._id);
      setHasReport(true);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        overflow: "hidden",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "#d4d4d8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      {/* Top Row */}
      <div
        style={{
          padding: "16px 18px 14px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flex: 1,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              flexShrink: 0,
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(147,51,234,0.1))",
              border: "1px solid rgba(139,92,246,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🔤
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
              {session.word}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
              {session.attempts.length} attempt
              {session.attempts.length !== 1 ? "s" : ""} · Last:{" "}
              {formatDate(session.updatedAt)}
            </div>
          </div>
        </div>

        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
          }}
        >
          <ScoreRing score={latest} size={50} stroke={4} />
          <div
            style={{ fontSize: 10, color: "#94a3b8", letterSpacing: "0.06em" }}
          >
            LATEST
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {hasReport ? (
            <>
              <button
                disabled
                style={{
                  padding: "7px 13px",
                  borderRadius: 9,
                  fontSize: 12,
                  fontWeight: 600,
                  background: "#f1f5f9",
                  color: "#94a3b8",
                  border: "1px solid #e2e8f0",
                  cursor: "not-allowed",
                  opacity: 0.7,
                }}
              >
                ✓ Done
              </button>
              <button
                onClick={() => onViewReport(session._id)}
                style={{
                  padding: "7px 13px",
                  borderRadius: 9,
                  fontSize: 12,
                  fontWeight: 600,
                  background: "rgba(139,92,246,0.1)",
                  color: "#7c3aed",
                  border: "1px solid rgba(139,92,246,0.3)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(139,92,246,0.18)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(139,92,246,0.1)")
                }
              >
                📄 View Report
              </button>
            </>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                padding: "7px 14px",
                borderRadius: 9,
                fontSize: 12,
                fontWeight: 600,
                background: generating
                  ? "#e2e8f0"
                  : "linear-gradient(135deg, #8b5cf6, #9333ea)",
                color: generating ? "#94a3b8" : "#fff",
                border: "none",
                cursor: generating ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {generating ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      animation: "spin 1s linear infinite",
                    }}
                  >
                    ⟳
                  </span>
                  Generating…
                </>
              ) : (
                "✦ Generate Report"
              )}
            </button>
          )}
        </div>

        <div
          style={{
            color: "#94a3b8",
            fontSize: 16,
            cursor: "pointer",
            transition: "transform 0.2s",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          ▾
        </div>
      </div>

      {/* Stats Strip */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #f1f5f9",
          borderBottom: expanded ? "1px solid #f8fafc" : "none",
        }}
      >
        {[
          { label: "Average", value: av, color: "#0f172a" },
          { label: "Best", value: best, color: "#0f172a" },
          { label: "Progress", value: trendStr, color: trendColor },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "9px 0",
              textAlign: "center",
              borderRight: i < 2 ? "1px solid #f1f5f9" : "none",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#94a3b8",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginTop: 1,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Attempts */}
      {expanded && (
        <div
          style={{
            padding: "14px 16px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 9,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#94a3b8",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            All Attempts
          </div>
          {session.attempts.map((att, i) => (
            <AttemptCard key={att._id} attempt={att} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Reports() {
  const { user } = useAuth();

  const { userSessions: sessions, isUserSessionsLoading } = useSession(
    user?.id,
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [toast, setToast] = useState<{
    msg: string;
    error?: boolean;
  } | null>(null);

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  const [reportModalOpen, setReportModalOpen] = useState(false);

  const {
    report,
    isReportLoading,
    generateReport,
  } = useReport(selectedSessionId || undefined, user?.id);

  const showToast = (msg: string, error = false) => {
    setToast({ msg, error });

    setTimeout(() => setToast(null), 3500);
  };

  // ────────────────────────────────────────────────────────────────────────────
  // GENERATE REPORT
  // ────────────────────────────────────────────────────────────────────────────

  const handleGenerate = async (sessionId: string) => {
    try {
      await generateReport(sessionId);

      showToast("Report generated successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to generate report", true);

      throw err;
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // VIEW REPORT
  // ────────────────────────────────────────────────────────────────────────────

  const handleViewReport = (sessionId: string) => {
    setSelectedSessionId(sessionId);

    setReportModalOpen(true);
  };


  const safeSessions = sessions ?? [];

  const filtered = useMemo(() => {
    return safeSessions.filter((s) => {
      const matchSearch = s.word
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchFilter =
        filter === "all" ||
        (filter === "reported" && s.hasReport) ||
        (filter === "pending" && !s.hasReport);

      return matchSearch && matchFilter;
    });
  }, [safeSessions, search, filter]);

  // ────────────────────────────────────────────────────────────────────────────
  // STATS
  // ────────────────────────────────────────────────────────────────────────────

  const totalAttempts = safeSessions.reduce(
    (n, s) => n + s.attempts.length,
    0,
  );

  const reportedCount = safeSessions.filter((s) => s.hasReport).length;

  const overallAvg = safeSessions.length
    ? Math.round(
        safeSessions.reduce((s, sess) => s + avgScore(sess.attempts), 0) /
          safeSessions.length,
      )
    : 0;

  const selectedSession = sessions?.find(
    (x) => x._id === selectedSessionId,
  );

  return (
    <Layout>
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          color: "#1e293b",
          fontFamily: "'Inter', 'system-ui', sans-serif",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap');

          * {
            box-sizing: border-box;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @keyframes toastIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          ::-webkit-scrollbar {
            width: 4px;
          }

          ::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 99px;
          }
        `}</style>

        <div style={{ maxWidth: "100%", padding: "24px 16px" }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 5,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#8b5cf6",
                }}
              />

              <span
                style={{
                  fontSize: 11,
                  color: "#8b5cf6",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Speech Reports
              </span>
            </div>

            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.03em",
                margin: "0 0 5px",
              }}
            >
              Word Progress
            </h1>

            <p
              style={{
                fontSize: 14,
                color: "#94a3b8",
                margin: 0,
              }}
            >
              Track pronunciation exercises, attempts, and reports
            </p>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
              marginBottom: 22,
            }}
          >
            {[
              {
                emoji: "🗣️",
                label: "Words Practiced",
                value: safeSessions.length,
              },

              {
                emoji: "🔁",
                label: "Total Attempts",
                value: totalAttempts,
              },

              {
                emoji: "⭐",
                label: "Avg. Score",
                value: overallAvg,
              },

              {
                emoji: "📋",
                label: "Reports Done",
                value: `${reportedCount}/${safeSessions.length}`,
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "14px 12px",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 6 }}>
                  {s.emoji}
                </div>

                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {s.value}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                flex: 1,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  fontSize: 14,
                }}
              >
                🔍
              </span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search words…"
                style={{
                  width: "100%",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "9px 12px 9px 34px",
                  color: "#1e293b",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              {["all", "reported", "pending"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    background:
                      filter === f
                        ? "rgba(139,92,246,0.1)"
                        : "#fff",

                    color:
                      filter === f
                        ? "#7c3aed"
                        : "#94a3b8",

                    border: `1px solid ${
                      filter === f
                        ? "rgba(139,92,246,0.35)"
                        : "#e2e8f0"
                    }`,

                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {isUserSessionsLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "50px 0",
                color: "#94a3b8",
              }}
            >
              <div
                style={{
                  fontSize: 30,
                  marginBottom: 10,
                  animation: "spin 1s linear infinite",
                  display: "inline-block",
                }}
              >
                ⟳
              </div>

              <div style={{ fontSize: 14 }}>
                Loading sessions…
              </div>
            </div>
          )}

          {/* Word Cards */}
          {!isUserSessionsLoading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {filtered.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "50px 0",
                    color: "#94a3b8",
                  }}
                >
                  <div
                    style={{
                      fontSize: 36,
                      marginBottom: 10,
                    }}
                  >
                    🔍
                  </div>

                  <div style={{ fontSize: 15 }}>
                    No words match your search.
                  </div>
                </div>
              ) : (
                filtered.map((session) => (
                  <WordCard
                    key={session._id}
                    session={session}
                    onGenerate={handleGenerate}
                    onViewReport={handleViewReport}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Report Modal */}
        {reportModalOpen && (
          <ReportModal
            report={report}
            session={selectedSession}
            isLoading={isReportLoading}
            onClose={() => {
              setReportModalOpen(false);

              setSelectedSessionId(null);
            }}
          />
        )}

        {/* Toast */}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: 22,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#fff",
              border: `1px solid ${
                toast.error
                  ? "#fecaca"
                  : "#e2e8f0"
              }`,
              borderRadius: 12,
              padding: "11px 18px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              animation: "toastIn 0.3s ease",
              zIndex: 100,
            }}
          >
            <span style={{ fontSize: 16 }}>
              {toast.error ? "❌" : "✅"}
            </span>

            <span
              style={{
                fontSize: 13,
                color: toast.error
                  ? "#dc2626"
                  : "#0f172a",

                fontWeight: 600,
              }}
            >
              {toast.msg}
            </span>
          </div>
        )}
      </div>
    </Layout>
  );
}