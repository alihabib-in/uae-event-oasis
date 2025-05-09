
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import { ThemeProvider } from "./components/ThemeProvider";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import PostEventPage from "./pages/PostEventPage";
import SubmitBidPage from "./pages/SubmitBidPage";
import ForBrandsPage from "./pages/ForBrandsPage";
import ForOrganizersPage from "./pages/ForOrganizersPage";
import ChatbotProvider from "./components/chatbot/ChatbotProvider";
import { AuthProvider } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ChatbotProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:eventId" element={<EventDetail />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/post-event" element={<PostEventPage />} />
                <Route path="/submit-bid/:eventId" element={<SubmitBidPage />} />
                <Route path="/for-brands" element={<ForBrandsPage />} />
                <Route path="/for-organizers" element={<ForOrganizersPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ChatbotProvider>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
