import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import Services from '@/pages/Services';
import Orders from '@/pages/Orders';
import AddFunds from '@/pages/AddFunds';
import Support from '@/pages/Support';
import SendFunds from '@/pages/SendFunds';

// Admin imports
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminServices from '@/pages/admin/AdminServices';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminTickets from '@/pages/admin/AdminTickets';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/panel" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="orders" element={<Orders />} />
          <Route path="add-funds" element={<AddFunds />} />
          <Route path="send-funds" element={<SendFunds />} />
          <Route path="support" element={<Support />} />
        </Route>
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="tickets" element={<AdminTickets />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
