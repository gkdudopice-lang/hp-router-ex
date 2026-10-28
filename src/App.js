import "./App.css";
import About from "./pages/About";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import BoardList from "./pages/boards/BoardList";
import BoardWrite from "./pages/boards/BoardWrite";
import BoardDetail from "./pages/boards/BoardDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. 로그인과 회원가입은 레이아웃 없이 단독 페이지로 설정 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 2. 기본 경로("/")를 포함하여 Layout을 거치는 페이지들 (홈 화면이 먼저 뜸) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />{" "}
          {/* 앱 접속 시 홈 화면이 기본으로 뜸 */}
          <Route path="/home" element={<Home />} />{" "}
          {/* /home으로 접속해도 홈으로 뜸 */}
          <Route path="/board" element={<BoardList />} />
          <Route path="/board/write" element={<BoardWrite />} />
          <Route path="/board/:boardId" element={<BoardDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile/:name" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
