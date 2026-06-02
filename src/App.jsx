import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import { Login, Register } from "./pages/AuthPages";
import Categories from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";

const protectedPage = (page, admin = false) => <ProtectedRoute admin={admin}>{page}</ProtectedRoute>;
export default function App() {
  return <AuthProvider><Layout><Routes>
    <Route path="/" element={<Home />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/admin-login" element={<AdminLogin />} />
    <Route path="/dashboard" element={protectedPage(<Dashboard />)} /><Route path="/categories" element={protectedPage(<Categories />)} />
    <Route path="/quiz/:category" element={protectedPage(<Quiz />)} /><Route path="/result/:id" element={protectedPage(<Result />)} />
    <Route path="/leaderboard" element={protectedPage(<Leaderboard />)} /><Route path="/profile" element={protectedPage(<Profile />)} />
    <Route path="/admin" element={protectedPage(<Admin />, true)} />
  </Routes></Layout></AuthProvider>;
}
