
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import IndexPage from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import EventsPage from "@/pages/EventsPage";
import EventDetail from "@/pages/EventDetail";
import SubmitBidPage from "@/pages/SubmitBidPage";
import ForBrandsPage from "@/pages/ForBrandsPage";
import ForOrganizersPage from "@/pages/ForOrganizersPage";
import ContactPage from "@/pages/ContactPage";
import PostEventPage from "@/pages/PostEventPage";
import AuthPage from "@/pages/AuthPage";
import LoginPage from "@/pages/LoginPage";
import AdminPage from "@/pages/AdminPage";
import AccountPage from "@/pages/AccountPage";
import RentSpacePage from "@/pages/RentSpacePage";

import "./App.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import ChatbotProvider from "@/components/chatbot/ChatbotProvider";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatbotProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/submit-bid/:id" element={<SubmitBidPage />} />
              <Route path="/for-brands" element={<ForBrandsPage />} />
              <Route path="/for-organizers" element={<ForOrganizersPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/post-event" element={<PostEventPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/rent-space" element={<RentSpacePage />} />
              
              {/* Protected routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              } />
              <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              
              {/* Not found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </ChatbotProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
