import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CopilotProvider } from "./context/CopilotContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import GameArena from "./pages/GameArena";
import Leaderboard from "./pages/Leaderboard";
import LandingPage from "./pages/LandingPage";
import SortingGame from "./pages/SortingGame";
import CodingChallenge from "./components/CodingChallenge";
import ChallengesList from "./pages/ChallengesList";
import FlexboxArena from "./pages/FlexboxArena";
import TicTacToeArena from "./pages/TicTacToeArena";
import QueensArena from "./pages/QueensArena";
import ZipGame from "./pages/ZipGame";
import GridArena from "./pages/GridArena";
import SpeedDebugging from "./pages/SpeedDebugging";
import MissionariesArena from "./pages/MissionariesArena";
import AlgorithmVisualizerHub from "./pages/AlgorithmVisualizerHub";
import AlgorithmVisualizerFrame from "./pages/AlgorithmVisualizerFrame";
import ChessArena from "./pages/ChessArena";
import Profile from "./pages/Profile";
import MessageCenter from "./pages/MessageCenter";
import TargetCursor from "./components/ui/TargetCursor";
import CopilotBridge from "./components/copilot/CopilotBridge";
import CopilotActionRouter from "./components/copilot/CopilotActionRouter";
import FloatingCopilot from "./components/copilot/FloatingCopilot";
// Support Pages
import { HelpCenter, Contact, PrivacyPolicy, TermsOfService } from "./pages/support";
// Community Pages
import { Forums, Blog, Events } from "./pages/community/index";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <CopilotProvider>
        <Router>
          <TargetCursor 
            spinDuration={2}
            hideDefaultCursor={true}
          />
          <CopilotBridge />
          <CopilotActionRouter />
          <FloatingCopilot />
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
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
            path="/game/tictactoe-arena"
            element={
              <ProtectedRoute>
                <TicTacToeArena />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/queens-arena"
            element={
              <ProtectedRoute>
                <QueensArena />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/zip-game"
            element={
              <ProtectedRoute>
                <ZipGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/grid-arena"
            element={
              <ProtectedRoute>
                <GridArena />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/speed-debugging"
            element={
              <ProtectedRoute>
                <SpeedDebugging />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/missionaries-arena"
            element={
              <ProtectedRoute>
                <MissionariesArena />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/chess-arena"
            element={
              <ProtectedRoute>
                <ChessArena />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visualizer"
            element={
              <ProtectedRoute>
                <AlgorithmVisualizerHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visualizer/:visualizerId"
            element={
              <ProtectedRoute>
                <AlgorithmVisualizerFrame />
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
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <MessageCenter />
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
          
          {/* Support Pages - Public Routes */}
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          
          {/* Community Pages - Public Routes */}
          <Route path="/forums" element={<Forums />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/events" element={<Events />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CopilotProvider>
    </AuthProvider>
  );
}

export default App;
