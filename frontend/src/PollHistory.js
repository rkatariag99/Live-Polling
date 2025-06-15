import { useEffect, useState } from "react";
import { socket } from "./socket";

function PollHistory() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    socket.emit("get-poll-history");

    socket.on("poll-history", (data) => {
      if (Array.isArray(data)) {
        setPolls(data);
      } else {
        setPolls([]);
      }
    });

    return () => socket.off("poll-history");
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "auto", paddingTop: 40, fontFamily: "sans-serif" }}>
      <h2>View <strong>Poll History</strong></h2>
      {polls.map((poll, idx) => {
        const total = Object.keys(poll.responses || {}).length;
        const counts = poll.options.map(
          (opt) => Object.values(poll.responses).filter(r => r.answer === opt).length
        );

        return (
          <div key={idx} style={{ marginBottom: 40 }}>
            <h4>Question {idx + 1}</h4>
            <div style={{
              backgroundColor: "#444", color: "white", padding: 12, borderRadius: "6px 6px 0 0"
            }}>{poll.question}</div>
            {poll.options.map((opt, i) => {
              const percent = Math.round((counts[i] / total) * 100) || 0;
              return (
                <div key={i} style={{ backgroundColor: "#f7f7f7", padding: 12, marginBottom: 6 }}>
                  <div style={{ background: "#7C3AED", width: `${percent}%`, height: 8, borderRadius: 4 }}></div>
                  <div style={{ marginTop: 4 }}>
                    <strong>{i + 1}</strong>. {opt} — {percent}%
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default PollHistory;
