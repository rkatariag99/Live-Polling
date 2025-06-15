import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Student() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (!name.trim()) return;
    sessionStorage.setItem("student-name", name.trim());
    navigate("/student/poll"); // assume student flow continues here
  };

  return (
    <div style={styles.container}>
      <span style={styles.tag}>✦ Intervue Poll</span>
      <div style={{ position: "absolute", top: 20, left: 20, fontSize: "14px", color: "#333", fontWeight: "bold" }}>
  👤 {name}
</div>
      <h1 style={styles.title}>
        Let’s <strong>Get Started</strong>
      </h1>
      <p style={styles.subtitle}>
        If you’re a student, you’ll be able to <strong>submit your answers</strong>, participate in live polls, and
        see how your responses compare with your classmates
      </p>

      <div style={styles.inputContainer}>
        <label style={styles.label}>Enter your Name</label>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rahul Bajaj"
        />
      </div>

      <button onClick={handleContinue} style={styles.button}>
        Continue
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: "auto",
    paddingTop: "60px",
    textAlign: "center",
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
  title: {
    fontSize: "28px",
    fontWeight: 500,
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
    maxWidth: 480,
    margin: "10px auto 40px",
  },
  inputContainer: {
    marginBottom: "30px",
    textAlign: "left",
    maxWidth: 400,
    marginInline: "auto",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#f5f5f5",
  },
  button: {
    background: "linear-gradient(to right, #7C3AED, #6366F1)",
    border: "none",
    color: "white",
    padding: "12px 32px",
    borderRadius: "999px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Student;
