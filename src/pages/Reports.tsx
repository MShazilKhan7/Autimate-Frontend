import Layout from "@/components/Layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/hooks/useSession";
import { useState } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_SESSIONS = [
  {
    _id: "s1",
    userId: "user123",
    wordId: "w1",
    word: "Apple",
    hasReport: false,
    createdAt: "2025-05-01T10:00:00Z",
    updatedAt: "2025-05-10T12:00:00Z",
    attempts: [
      {
        _id: "a1",
        word: "Apple",
        quality_score: 72,
        quality_class: "Good",
        llmFeedback:
          "Great effort! Your pronunciation of 'Apple' is improving. Focus on the 'pp' consonant cluster in the middle — try pressing your lips firmly together.",
        createdAt: "2025-05-01T10:05:00Z",
        phone_score_list: [
          { phone: "AE", quality_score: 85, sound_most_like: "AE" },
          { phone: "P", quality_score: 60, sound_most_like: "B" },
          { phone: "AH", quality_score: 78, sound_most_like: "AH" },
          { phone: "L", quality_score: 70, sound_most_like: "L" },
        ],
      },
      {
        _id: "a2",
        word: "Apple",
        quality_score: 84,
        quality_class: "Excellent",
        llmFeedback:
          "Wonderful improvement! The 'AE' vowel sound at the start is now very clear. Keep up this great work!",
        createdAt: "2025-05-05T11:00:00Z",
        phone_score_list: [
          { phone: "AE", quality_score: 92, sound_most_like: "AE" },
          { phone: "P", quality_score: 75, sound_most_like: "P" },
          { phone: "AH", quality_score: 88, sound_most_like: "AH" },
          { phone: "L", quality_score: 82, sound_most_like: "L" },
        ],
      },
      {
        _id: "a3",
        word: "Apple",
        quality_score: 91,
        quality_class: "Excellent",
        llmFeedback:
          "Outstanding! Almost perfect pronunciation. The 'L' sound at the end can be softened slightly.",
        createdAt: "2025-05-10T09:30:00Z",
        phone_score_list: [
          { phone: "AE", quality_score: 95, sound_most_like: "AE" },
          { phone: "P", quality_score: 88, sound_most_like: "P" },
          { phone: "AH", quality_score: 92, sound_most_like: "AH" },
          { phone: "L", quality_score: 89, sound_most_like: "L" },
        ],
      },
    ],
  },
  {
    _id: "s2",
    userId: "user123",
    wordId: "w2",
    word: "Butterfly",
    hasReport: true,
    createdAt: "2025-05-02T14:00:00Z",
    updatedAt: "2025-05-11T16:00:00Z",
    attempts: [
      {
        _id: "a4",
        word: "Butterfly",
        quality_score: 55,
        quality_class: "Needs Practice",
        llmFeedback:
          "Good try! 'Butterfly' is a complex word. Focus on the 'B' sound at the beginning — close your lips and release a short burst of air.",
        createdAt: "2025-05-02T14:10:00Z",
        phone_score_list: [
          { phone: "B", quality_score: 50, sound_most_like: "P" },
          { phone: "AH", quality_score: 70, sound_most_like: "AH" },
          { phone: "T", quality_score: 60, sound_most_like: "D" },
          { phone: "ER", quality_score: 45, sound_most_like: "AH" },
          { phone: "F", quality_score: 65, sound_most_like: "V" },
          { phone: "L", quality_score: 55, sound_most_like: "L" },
          { phone: "IY", quality_score: 72, sound_most_like: "IY" },
        ],
      },
      {
        _id: "a5",
        word: "Butterfly",
        quality_score: 68,
        quality_class: "Good",
        llmFeedback:
          "Much better! The 'B' sound improved significantly. Now let's work on the 'ER' vowel — try making a soft growling sound in the back of your throat.",
        createdAt: "2025-05-08T10:30:00Z",
        phone_score_list: [
          { phone: "B", quality_score: 74, sound_most_like: "B" },
          { phone: "AH", quality_score: 78, sound_most_like: "AH" },
          { phone: "T", quality_score: 70, sound_most_like: "T" },
          { phone: "ER", quality_score: 55, sound_most_like: "AH" },
          { phone: "F", quality_score: 72, sound_most_like: "F" },
          { phone: "L", quality_score: 68, sound_most_like: "L" },
          { phone: "IY", quality_score: 80, sound_most_like: "IY" },
        ],
      },
    ],
  },
  {
    _id: "s3",
    userId: "user123",
    wordId: "w3",
    word: "Rainbow",
    hasReport: false,
    createdAt: "2025-05-03T09:00:00Z",
    updatedAt: "2025-05-09T11:00:00Z",
    attempts: [
      {
        _id: "a6",
        word: "Rainbow",
        quality_score: 88,
        quality_class: "Excellent",
        llmFeedback:
          "Excellent work on 'Rainbow'! The 'R' sound was very well produced. Keep practicing!",
        createdAt: "2025-05-03T09:15:00Z",
        phone_score_list: [
          { phone: "R", quality_score: 90, sound_most_like: "R" },
          { phone: "EY", quality_score: 88, sound_most_like: "EY" },
          { phone: "N", quality_score: 85, sound_most_like: "N" },
          { phone: "B", quality_score: 87, sound_most_like: "B" },
          { phone: "OW", quality_score: 91, sound_most_like: "OW" },
        ],
      },
    ],
  },
  {
    _id: "s4",
    userId: "user123",
    wordId: "w4",
    word: "Elephant",
    hasReport: false,
    createdAt: "2025-05-04T13:00:00Z",
    updatedAt: "2025-05-12T14:00:00Z",
    attempts: [
      {
        _id: "a7",
        word: "Elephant",
        quality_score: 62,
        quality_class: "Good",
        llmFeedback:
          "Nice job! The 'EH' vowel at the start was clear. The 'PH' sound (pronounced as 'F') needs more practice — place your upper teeth gently on your lower lip.",
        createdAt: "2025-05-04T13:05:00Z",
        phone_score_list: [
          { phone: "EH", quality_score: 80, sound_most_like: "EH" },
          { phone: "L", quality_score: 65, sound_most_like: "L" },
          { phone: "AH", quality_score: 70, sound_most_like: "AH" },
          { phone: "F", quality_score: 50, sound_most_like: "V" },
          { phone: "AH", quality_score: 68, sound_most_like: "AH" },
          { phone: "N", quality_score: 72, sound_most_like: "N" },
          { phone: "T", quality_score: 60, sound_most_like: "D" },
        ],
      },
      {
        _id: "a8",
        word: "Elephant",
        quality_score: 75,
        quality_class: "Good",
        llmFeedback:
          "Good progress! The 'F' sound is getting better. Practice by blowing gently through your front teeth.",
        createdAt: "2025-05-12T14:00:00Z",
        phone_score_list: [
          { phone: "EH", quality_score: 85, sound_most_like: "EH" },
          { phone: "L", quality_score: 72, sound_most_like: "L" },
          { phone: "AH", quality_score: 75, sound_most_like: "AH" },
          { phone: "F", quality_score: 68, sound_most_like: "F" },
          { phone: "AH", quality_score: 74, sound_most_like: "AH" },
          { phone: "N", quality_score: 80, sound_most_like: "N" },
          { phone: "T", quality_score: 71, sound_most_like: "T" },
        ],
      },
    ],
  },
  {
    _id: "s5",
    userId: "user123",
    wordId: "w5",
    word: "Star",
    hasReport: true,
    createdAt: "2025-05-05T08:00:00Z",
    updatedAt: "2025-05-07T09:00:00Z",
    attempts: [
      {
        _id: "a9",
        word: "Star",
        quality_score: 95,
        quality_class: "Excellent",
        llmFeedback:
          "Perfect! 'Star' was pronounced beautifully. Every phoneme was accurate and clear!",
        createdAt: "2025-05-07T09:00:00Z",
        phone_score_list: [
          { phone: "S", quality_score: 96, sound_most_like: "S" },
          { phone: "T", quality_score: 94, sound_most_like: "T" },
          { phone: "AA", quality_score: 97, sound_most_like: "AA" },
          { phone: "R", quality_score: 93, sound_most_like: "R" },
        ],
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const scoreColor = (score) => {
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#f59e0b";
  if (score >= 50) return "#f97316";
  return "#ef4444";
};

const avgScore = (attempts) =>
  attempts.length
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
    await onGenerate(session._id);
    setTimeout(() => {
      setGenerating(false);
      setHasReport(true);
    }, 2000);
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
                📄 View
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
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: stat.color,
                fontFamily: "Inter, sans-serif",
              }}
            >
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

// ─── Report Modal ─────────────────────────────────────────────────────────────
function ReportModal({ session, onClose }) {
  if (!session) return null;
  const av = avgScore(session.attempts);
  const best = session.attempts.reduce(
    (b, a) => (a.quality_score > b ? a.quality_score : b),
    0,
  );

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
        background: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 580,
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          overflow: "hidden",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "22px 24px 18px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
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
                fontSize: 24,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              "{session.word}"
            </div>
          </div>
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

        {/* Summary */}
        <div style={{ padding: "20px 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              marginBottom: 22,
            }}
          >
            {[
              { emoji: "📊", label: "Avg. Score", value: av },
              { emoji: "🏆", label: "Best Score", value: best },
              {
                emoji: "🔄",
                label: "Attempts",
                value: session.attempts.length,
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
                <div style={{ fontSize: 20, marginBottom: 5 }}>{s.emoji}</div>
                <div
                  style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Timeline */}
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
                display: "flex",
                alignItems: "flex-end",
                gap: 7,
                height: 80,
              }}
            >
              {session.attempts.map((att, i) => {
                const h = Math.round((att.quality_score / 100) * 66);
                const color = scoreColor(att.quality_score);
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <div style={{ fontSize: 11, color, fontWeight: 700 }}>
                      {att.quality_score}
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: h,
                        background: color,
                        borderRadius: "4px 4px 0 0",
                        opacity: 0.85,
                        minHeight: 4,
                        transition: "height 0.6s ease",
                      }}
                    />
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>
                      #{i + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Latest Feedback */}
          {session.attempts.at(-1)?.llmFeedback && (
            <div
              style={{
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.18)",
                borderRadius: 12,
                padding: 16,
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
                Latest AI Feedback
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {session.attempts.at(-1).llmFeedback}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "0 24px 22px",
            textAlign: "center",
            fontSize: 12,
            color: "#94a3b8",
          }}
        >
          Generated on{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SpeechTherapyReports() {
  const { user } = useAuth();
  const { userSessions: sessions, isUserSessionsLoading } = useSession(
    user?.id,
  );
  // const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [reportModal, setReportModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = async (sessionId) => {
    // await new Promise((r) => setTimeout(r, 2000));
    // setSessions((prev) =>
    //   prev.map((s) => (s._id === sessionId ? { ...s, hasReport: true } : s)),
    // );
    showToast("Report generated successfully!");
  };

  const handleViewReport = (sessionId) => {
    setReportModal(sessions?.find((x) => x._id === sessionId));
  };

  const filtered = sessions.filter((s) => {
    const matchSearch = s.word.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "reported" && s.hasReport) ||
      (filter === "pending" && !s.hasReport);
    return matchSearch && matchFilter;
  });

  const totalAttempts = sessions.reduce((n, s) => n + s.attempts.length, 0);
  const reportedCount = sessions.filter((s) => s.hasReport).length;
  const overallAvg = Math.round(
    sessions.reduce((s, sess) => s + avgScore(sess.attempts), 0) /
      sessions.length,
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
        * { box-sizing: border-box; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
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
            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
              Track pronunciation exercises, attempts, and reports
            </p>
          </div>

          {/* Stats Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
              marginBottom: 22,
            }}
          >
            {[
              { emoji: "🗣️", label: "Words Practiced", value: sessions.length },
              { emoji: "🔁", label: "Total Attempts", value: totalAttempts },
              { emoji: "⭐", label: "Avg. Score", value: overallAvg },
              {
                emoji: "📋",
                label: "Reports Done",
                value: `${reportedCount}/${sessions.length}`,
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
                <div style={{ fontSize: 18, marginBottom: 6 }}>{s.emoji}</div>
                <div
                  style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <div style={{ flex: 1, position: "relative" }}>
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
                  fontFamily: "Inter, sans-serif",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
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
                    background: filter === f ? "rgba(139,92,246,0.1)" : "#fff",
                    color: filter === f ? "#7c3aed" : "#94a3b8",
                    border: `1px solid ${filter === f ? "rgba(139,92,246,0.35)" : "#e2e8f0"}`,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    transition: "all 0.15s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Word Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "50px 0",
                  color: "#94a3b8",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                <div style={{ fontSize: 15 }}>No words match your search.</div>
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
        </div>

        {/* Report Modal */}
        {reportModal && (
          <ReportModal
            session={reportModal}
            onClose={() => setReportModal(null)}
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
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "11px 18px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              animation: "toastIn 0.3s ease",
              zIndex: 100,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 16 }}>✅</span>
            <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 600 }}>
              {toast}
            </span>
          </div>
        )}
      </div>
    </Layout>
  );
}
