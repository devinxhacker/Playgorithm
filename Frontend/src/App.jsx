import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GameArena from "./pages/GameArena";
import Leaderboard from "./pages/Leaderboard";
import LandingPage from "./pages/LandingPage";
import SortingGame from "./pages/SortingGame";
import CodingChallenge from "./components/CodingChallenge";
import ChallengesList from "./pages/ChallengesList";
import FlexboxArena from "./pages/FlexboxArena";
import TargetCursor from "./components/ui/TargetCursor";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <TargetCursor 
          spinDuration={2}
          hideDefaultCursor={true}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/sorting-showdown"
            element={
              <ProtectedRoute>
                <SortingGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/flexbox-arena"
            element={
              <ProtectedRoute>
                <FlexboxArena />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <ProtectedRoute>
                <ChallengesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/:gameId"
            element={
              <ProtectedRoute>
                <GameArena />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coding-challenge/:challengeId"
            element={
              <ProtectedRoute>
                <CodingChallenge />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
