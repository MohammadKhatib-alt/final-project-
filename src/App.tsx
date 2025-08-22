import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Kitchen from "@/pages/Kitchen";
import Packaging from "@/pages/Packaging";
import Delivery from "@/pages/Delivery";
import Orders from "@/pages/Orders";
import Courier from "@/pages/Courier";
import CustomerService from "@/pages/CustomerService";
import Reports from "@/pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/kitchen" element={
              <ProtectedRoute>
                <Kitchen />
              </ProtectedRoute>
            } />
            <Route path="/packaging" element={
              <ProtectedRoute>
                <Packaging />
              </ProtectedRoute>
            } />
            <Route path="/delivery" element={
              <ProtectedRoute>
                <Delivery />
              </ProtectedRoute>
            } />
            <Route path="/courier" element={
              <ProtectedRoute>
                <Courier />
              </ProtectedRoute>
            } />
            <Route path="/customer-service" element={
              <ProtectedRoute>
                <CustomerService />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
