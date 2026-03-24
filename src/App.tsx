import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FootballDashboard from "./pages/FootballDashboard";

function App() {
    return (
        <Router>
            <Routes>
                {/* 기본 경로를 순위표(standings) 대시보드로 리다이렉트하거나 바로 보여줌 */}
                <Route path="/" element={<FootballDashboard />} />

                {/* 나중에 상세 페이지가 생기면 아래와 같이 확장합니다. */}
                {/* <Route path="/player/:id" element={<PlayerDetail />} /> */}

                {/* 잘못된 경로는 홈으로 */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;