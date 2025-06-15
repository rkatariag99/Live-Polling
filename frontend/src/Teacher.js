import { useEffect, useState } from "react";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";

function Teacher() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(60);
  const [results, setResults] = useState(null);
  const [isPollActive, setIsPollActive] = useState(false);

  useEffect(() => {
    socket.on("poll-update", (data) => setResults(data));
    socket.on("poll-end", (data) => {
      setResults(data);
      setIsPollActive(false);
    });

    return () => {
      socket.off("poll-update");
      socket.off("poll-end");
    };
  }, []);

  const createPoll = () => {
    if (!question.trim() || options.some((opt) => !opt.trim())) return;
    socket.emit("teacher-create-poll", {
      question: question.trim(),
      options: options.map((o) => o.trim()),
      duration,
    });
    setIsPollActive(true);
    setResults(null);
  };

  const endPoll = () => {
    socket.emit("end-poll-force");
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const updateOption = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const renderResults = () => {
    if (!results || !question || !options.length) return null;

    const total = Object.keys(results || {}).length;
    const counts = options.map(
      (opt) =>
        Object.values(results || {}).filter((res) => res.answer === opt).length
    );

    return (
      <div style={styles.results}>
        <h3>Live Poll Results</h3>
        <p><strong>Q:</strong> {question}</p>
        {options.map((opt, i) => {
          const percent = Math.round((counts[i] / total) * 100) || 0;
          return (
            <div key={i} style={styles.resultBarWrapper}>
              <div style={styles.resultBarTrack}>
                <div style={{ ...styles.resultBar, width: `${percent}%` }}></div>
              </div>
              <div>
                <strong>{i + 1}.</strong> {opt} — {percent}%
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1>Teacher Panel</h1>

      <div style={styles.topRight}>
        <button style={styles.viewHistoryBtn} onClick={() => navigate("/history")}>
          📜 View Poll History
        </button>
      </div>

      <div style={styles.form}>
        <label>Poll Question:</label>
        <textarea
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your poll question..."
          style={styles.textarea}
        />

        <label>Options:</label>
        {options.map((opt, i) => (
          <input
            key={i}
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            style={styles.input}
          />
        ))}

        {options.length < 6 && (
          <button onClick={addOption} style={styles.addOptionBtn}>
            + Add Option
          </button>
        )}

        <label>Duration (seconds):</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          style={styles.select}
        >
          <option value={30}>30</option>
          <option value={45}>45</option>
          <option value={60}>60</option>
        </select>

        <div style={{ marginTop: 20 }}>
          {!isPollActive ? (
            <button onClick={createPoll} style={styles.askBtn}>Ask Question</button>
          ) : (
            <button onClick={endPoll} style={styles.endBtn}>End Poll</button>
          )}
        </div>
      </div>

      {renderResults()}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: "auto",
    padding: 20,
    fontFamily: "sans-serif",
  },
  topRight: {
    textAlign: "right",
  },
  viewHistoryBtn: {
    backgroundColor: "#6366F1",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: 999,
    cursor: "pointer",
    marginBottom: 16,
  },
  form: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  textarea: {
    width: "100%",
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  addOptionBtn: {
    padding: "6px 12px",
    border: "1px solid #7C3AED",
    backgroundColor: "white",
    color: "#7C3AED",
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: 16,
  },
  select: {
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
    width: "100%",
  },
  askBtn: {
    backgroundColor: "#7C3AED",
    color: "white",
    padding: "10px 20px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },
  endBtn: {
    backgroundColor: "#dc2626",
    color: "white",
    padding: "10px 20px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },
  results: {
    marginTop: 30,
  },
  resultBarWrapper: {
    marginBottom: 12,
  },
  resultBarTrack: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginBottom: 4,
  },
  resultBar: {
    height: 8,
    backgroundColor: "#7C3AED",
    borderRadius: 4,
  },
};

export default Teacher;
