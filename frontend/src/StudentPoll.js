import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "./socket";

function StudentPoll() {
  const navigate = useNavigate();
  const [name] = useState(sessionStorage.getItem("student-name"));
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // On initial mount and poll setup
  useEffect(() => {
    if (!name) navigate("/student");

    socket.emit("student-join", name);

    const handlePollStart = (data) => {
      setPoll(data);
      setResults(null);
      setSelected(null);
      setHasSubmitted(false);
      setTimeLeft(data.duration || 60);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (!hasSubmitted) {
              socket.emit("student-answer", { answer: "No Response" });
              setHasSubmitted(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const handlePollEnd = (data) => {
      if (hasSubmitted) {
        setResults(data);
        clearInterval(timerRef.current);
      }
    };

    const handlePollUpdate = (data) => {
      if (hasSubmitted) {
        setResults(data); // live updates after submit
      }
    };

    socket.on("poll-start", handlePollStart);
    socket.on("poll-end", handlePollEnd);
    socket.on("poll-update", handlePollUpdate);

    return () => {
      socket.off("poll-start", handlePollStart);
      socket.off("poll-end", handlePollEnd);
      socket.off("poll-update", handlePollUpdate);
      clearInterval(timerRef.current);
    };
  }, [name, hasSubmitted, navigate]);

  const submit = () => {
    if (selected && !hasSubmitted) {
      socket.emit("student-answer", { answer: selected });
      setHasSubmitted(true);
      clearInterval(timerRef.current);
    }
  };

  const renderWaiting = () => (
    <div style={styles.center}>
      <span style={styles.tag}>✦ Intervue Poll</span>
      <div style={styles.loader}></div>
      <h2>Wait for the teacher to ask questions..</h2>
    </div>
  );

  const renderPoll = () => (
    <div style={styles.pollBox}>
      <div style={styles.pollHeader}>
        <span><strong>Question</strong></span>
        <span style={{ color: "red" }}>⏱ {timeLeft}s</span>
      </div>
      <div style={styles.question}>{poll.question}</div>
      {poll.options.map((opt, index) => (
        <div
          key={index}
          style={{
            ...styles.option,
            border: selected === opt ? "2px solid #7C3AED" : "1px solid #ddd",
          }}
          onClick={() => setSelected(opt)}
        >
          <span style={styles.optionIndex}>{index + 1}</span>
          {opt}
        </div>
      ))}
      <button onClick={submit} style={styles.button}>Submit</button>
    </div>
  );

  const renderResults = () => {
    if (!poll || !poll.options) return null;

    const total = Object.keys(results || {}).length;
    const counts = poll.options.map(
      (opt) =>
        Object.values(results || {}).filter((res) => res.answer === opt).length
    );

    return (
      <div style={styles.pollBox}>
        <div style={styles.pollHeader}><strong>Results</strong></div>
        <div style={{ position: "absolute", top: 20, left: 20, fontSize: "14px", color: "#333", fontWeight: "bold" }}>
          👤 {name}
        </div>
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
        <p style={{ textAlign: "center" }}>Wait for the teacher to ask a new question..</p>
      </div>
    );
  };

  if (!poll && !results) return renderWaiting();
  if (results && poll) return renderResults();
  if (poll && !results) return renderPoll();
  return null;
}

const styles = {
  center: {
    textAlign: "center",
    paddingTop: "80px",
    fontFamily: "sans-serif",
  },
  tag: {
    backgroundColor: "#7C3AED",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "14px",
    display: "inline-block",
    marginBottom: "20px",
  },
  loader: {
    width: 40,
    height: 40,
    border: "4px solid #ddd",
    borderTop: "4px solid #7C3AED",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "20px auto",
  },
  pollBox: {
    maxWidth: 600,
    margin: "60px auto",
    padding: 20,
    border: "1px solid #eee",
    borderRadius: 12,
    fontFamily: "sans-serif",
    position: "relative",
  },
  pollHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
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
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 12,
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
  button: {
    marginTop: 20,
    background: "linear-gradient(to right, #7C3AED, #6366F1)",
    border: "none",
    color: "white",
    padding: "10px 30px",
    borderRadius: "999px",
    fontSize: "16px",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
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
};

export default StudentPoll;
