import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LandingPage } from './components/pages/LandingPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import About from './pages/About';
import AccountType from './pages/AccountType';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import NotFound from './pages/NotFound';
import Onboarding from './pages/Onboarding';
import ProfileSetup from './pages/ProfileSetup';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account-type" element={<AccountType />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/farms" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/farms/:farmId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/farms/:farmId/:module" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
