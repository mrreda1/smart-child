import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AppContextProvider } from "./context/AppContext";

import LandingPage from "./views/LandingPage";
import ParentDashboard from "./views/Dashboards/ParentDashboard";
import ChildDashboard from "./views/Dashboards/ChildDashboard";
import FreePlayMenu from "./views/Games/InteractiveGames";
import GamifiedLoader from "./views/Games/GamifiedLoader";
import GamePlay from "./views/Games/GamePlay";
import ReportsDashboard from "./views/Dashboards/ReportsDashboard";
import AuthLayoutWrapper from "./layouts/AuthLayout";
import Login from "./views/Auth/Login";
import Register from "./views/Auth/Register";
import ForgotPassword from "./views/Auth/ForgotPassword";
import ConfirmEmail from "./views/Auth/ConfirmEmail";
import VerifyEmail from "./views/Auth/VerifyEmail";
import ResetPassword from "./views/Auth/ResetPassword";

import authService from "@/services/authService.js";

import { ToastContainer } from "react-toastify";
import { NotFoundPage } from "./views/NotFoundPage";
import { ParentProfile } from "./views/ParentProfile";
import { ParentDashboardLayout } from "./layouts/ParentDashboardLayout";

const basename = import.meta.env.VITE_URL_BASENAME;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Router basename={basename || "/"}>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/parent" element={<ParentDashboardLayout />}>
              <Route path="dashboard" element={<ParentDashboard />} />
              <Route path="profile" element={<ParentProfile />} />
              <Route path="child/reports" element={<ReportsDashboard />} />
            </Route>

            <Route path="/child-dashboard" element={<ChildDashboard />} />
            <Route path="/free-play" element={<FreePlayMenu />} />
            <Route path="/game" element={<GamePlay />} />
            {/* Auth Routes */}
            <Route element={<AuthLayoutWrapper />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </AppContextProvider>
    </QueryClientProvider>
  );
}
