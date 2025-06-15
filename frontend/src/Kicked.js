function Kicked() {
  return (
    <div style={{ textAlign: "center", paddingTop: 100, fontFamily: "sans-serif" }}>
      <span style={{
        backgroundColor: "#7C3AED",
        color: "#fff",
        padding: "4px 12px",
        borderRadius: "999px",
        fontSize: "14px",
        display: "inline-block",
        marginBottom: "20px",
      }}>
        ✦ Intervue Poll
      </span>
      <h1>You’ve been <strong>Kicked out</strong>!</h1>
      <p>Looks like the teacher removed you from the poll system. Please try again sometime.</p>
    </div>
  );
}

export default Kicked;
