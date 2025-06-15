import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Teacher from "./Teacher";
import Student from "./Student";
import StudentPoll from "./StudentPoll";
import TeacherResults from "./TeacherResults";
import PollHistory from "./PollHistory";
import Kicked from "./Kicked";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/student/poll" element={<StudentPoll />} />
        <Route path="/teacher/results" element={<TeacherResults />} />
        <Route path="/history" element={<PollHistory />} />
        <Route path="/kicked" element={<Kicked />} />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
