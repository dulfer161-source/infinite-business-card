import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import InstallPrompt from "./components/InstallPrompt";
import ErrorBoundary from "./components/ErrorBoundary";
import PageLoader from "./components/PageLoader";
import FeedbackWidget from "./components/FeedbackWidget";
import Index from "./pages/Index";
import PublicCard from "./pages/PublicCard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";
import YooKassaSetup from "./pages/YooKassaSetup";
import TestAI from "./pages/TestAI";
import VKCallback from "./pages/VKCallback";
import VKDiagnostics from "./pages/VKDiagnostics";
import GoogleCallback from "./pages/GoogleCallback";
import YandexCallback from "./pages/YandexCallback";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <InstallPrompt />
          <FeedbackWidget />
          <BrowserRouter future={future}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/card/:id" element={<PublicCard />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/error" element={<PaymentError />} />
                <Route path="/yookassa-setup" element={<YooKassaSetup />} />
                <Route path="/test-ai" element={<TestAI />} />
                <Route path="/auth/vk" element={<VKCallback />} />
                <Route path="/auth/google" element={<GoogleCallback />} />
                <Route path="/auth/yandex" element={<YandexCallback />} />
                <Route path="/vk-diagnostics" element={<VKDiagnostics />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;