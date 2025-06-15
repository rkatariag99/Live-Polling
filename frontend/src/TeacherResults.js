import { useEffect, useState } from "react";
import { socket } from "./socket";

function TeacherResults() {
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    socket.on("poll-start", (data) => {
      setPoll(data);
      setResults(null);
    });

    socket.on("poll-update", (data) => setResults(data));
    socket.on("poll-end", (data) => setResults(data));

    return () => {
      socket.off("poll-start");
      socket.off("poll-update");
      socket.off("poll-end");
    };
  }, []);

  const renderResults = () => {
    const total = Object.keys(results || {}).length;
    const counts = poll.options.map(
      (opt) =>
        Object.values(results || {}).filter((res) => res.answer === opt).length
    );

    return (
      <div style={styles.container}>
        <div style={styles.topRight}>
          <button style={styles.viewBtn} onClick={() => alert("Link to /history")}>
            👁 View Poll history
          </button>
        </div>
        <div style={styles.pollBox}>
          <div style={styles.questionHeader}>Question</div>
          <div style={styles.question}>{poll.question}</div>
          {poll.options.map((opt, i) => {
            const percent = Math.round((counts[i] / total) * 100) || 0;
            return (
              <div key={i} style={{ ...styles.option, padding: "10px 16px" }}>
                <div style={styles.resultBarContainer}>
                  <div style={{ ...styles.resultBar, width: `${percent}%` }}></div>
                </div>
                <div style={styles.resultLabel}>
                  <span style={styles.optionIndex}>{i + 1}</span>
                  {opt} — <strong>{percent}%</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return !poll ? (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      Waiting for active poll…
    </div>
  ) : results ? renderResults() : <div style={{ textAlign: "center", padding: "100px" }}>Waiting for responses…</div>;
}

const styles = {
  container: {
    fontFamily: "sans-serif",
    maxWidth: 700,
    margin: "auto",
    paddingTop: 40,
  },
  topRight: {
    textAlign: "right",
    marginBottom: 16,
  },
  viewBtn: {
    backgroundColor: "#8b5cf6",
    color: "white",
    padding: "8px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
  },
  pollBox: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fafafa",
  },
  questionHeader: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  question: {
    backgroundColor: "#444",
    color: "white",
    padding: 12,
    borderRadius: "6px 6px 0 0",
    fontWeight: "bold",
    marginBottom: 16,
  },
  option: {
    backgroundColor: "#f7f7f7",
    marginBottom: 12,
    borderRadius: 8,
  },
  resultBarContainer: {
    backgroundColor: "#eee",
    height: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  resultBar: {
    backgroundColor: "#7C3AED",
    height: "100%",
    borderRadius: 6,
  },
  resultLabel: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  optionIndex: {
    backgroundColor: "#7C3AED",
    color: "white",
    borderRadius: "50%",
    width: 24,
    height: 24,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
  },
};

export default TeacherResults;
