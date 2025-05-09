
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import { ThemeProvider } from "./components/ThemeProvider";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import PostEventPage from "./pages/PostEventPage";
import ForBrandsPage from "./pages/ForBrandsPage";
import ForOrganizersPage from "./pages/ForOrganizersPage";
import ChatbotProvider from "./components/chatbot/ChatbotProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
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
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/post-event" element={<PostEventPage />} />
              <Route path="/for-brands" element={<ForBrandsPage />} />
              <Route path="/for-organizers" element={<ForOrganizersPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ChatbotProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
