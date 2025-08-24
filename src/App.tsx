
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ContentPersistenceProvider } from "./context/ContentPersistenceContext";
import { AuthGuard } from "./components/AuthGuard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import CreatePostPage from "./pages/CreatePostPage";
import ComparisonPage from "./pages/ComparisonPage";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <ContentPersistenceProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
                <Route path="/create" element={<AuthGuard><CreatePostPage /></AuthGuard>} />
                <Route path="/compare" element={<AuthGuard><ComparisonPage /></AuthGuard>} />
                <Route path="/history" element={<AuthGuard><HistoryPage /></AuthGuard>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <SpeedInsights />
            <Analytics />
          </ContentPersistenceProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
