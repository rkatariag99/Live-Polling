import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("student");

  const handleContinue = () => {
    navigate(selectedRole === "student" ? "/student" : "/teacher");
  };

  return (
    <div style={styles.container}>
      <span style={styles.tag}>✦ Intervue Poll</span>
      <h1 style={styles.title}>
        Welcome to the <strong>Live Polling System</strong>
      </h1>
      <p style={styles.subtitle}>
        Please select the role that best describes you to begin using the live polling system
      </p>

      <div style={styles.cardContainer}>
        <div
          onClick={() => setSelectedRole("student")}
          style={{
            ...styles.card,
            border: selectedRole === "student" ? "2px solid #7C3AED" : "1px solid #ccc",
          }}
        >
          <h3>I’m a Student</h3>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
        </div>
        <div
          onClick={() => setSelectedRole("teacher")}
          style={{
            ...styles.card,
            border: selectedRole === "teacher" ? "2px solid #7C3AED" : "1px solid #ccc",
          }}
        >
          <h3>I’m a Teacher</h3>
          <p>Submit answers and view live poll results in real-time.</p>
        </div>
      </div>

      <button style={styles.button} onClick={handleContinue}>Continue</button>
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
    marginBottom: "40px",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  card: {
    width: "260px",
    padding: "20px",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "left",
    transition: "0.2s",
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

export default Home;
