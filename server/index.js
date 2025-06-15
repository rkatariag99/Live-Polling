const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
app.use(cors());
const io = new Server(server, { cors: { origin: "*" } });

// State
let currentPoll = null;
let answers = {};
let students = {};
let pollHistory = [];
let hasAnswered = {};

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // When a student joins
  socket.on("student-join", (name) => {
    students[socket.id] = name;
    hasAnswered[socket.id] = false;
    if (currentPoll) {
      socket.emit("poll-start", currentPoll);
    }
  });

  // When teacher creates a new poll
  socket.on("teacher-create-poll", (poll) => {
    currentPoll = poll;
    answers = {};
    hasAnswered = {};

    // Mark all existing students as not answered
    for (let id in students) {
      hasAnswered[id] = false;
    }

    io.emit("poll-start", poll);
    console.log("📢 New poll started:", poll.question);
  });

  // When a student submits an answer
  socket.on("student-answer", (data) => {
    if (hasAnswered[socket.id]) {
      console.log(`⛔ Student ${students[socket.id]} already submitted. Ignoring.`);
      return;
    }

    console.log(`✅ Answer received from ${students[socket.id]}: ${data.answer}`);

    answers[socket.id] = {
      name: students[socket.id],
      answer: data.answer,
    };
    hasAnswered[socket.id] = true;

    // Send poll results so far to everyone (live updates)
    io.emit("poll-update", answers);

    // If all students have answered
    if (Object.keys(answers).length === Object.keys(students).length) {
      pollHistory.push({ ...currentPoll, responses: { ...answers } });
      io.emit("poll-end", answers);
      currentPoll = null;
    }

    // Also send results to this student so they can view early
    socket.emit("poll-end", answers);
  });

  // Teacher manually ends the poll
  socket.on("end-poll-force", () => {
    io.emit("poll-end", answers);
    currentPoll = null;
    console.log("⚠️ Poll force-ended by teacher.");
  });

  // Fetch poll history
  socket.on("get-poll-history", () => {
    socket.emit("poll-history", pollHistory || []);
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    delete students[socket.id];
    delete answers[socket.id];
    delete hasAnswered[socket.id];
  });
});

server.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
