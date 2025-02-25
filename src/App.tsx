import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Account from './pages/Account';
import Courses from './pages/Courses';
import Progress from './pages/Progress';
import Evaluate from './pages/Evaluate';
import Legal from './pages/Legal';
import Partners from './pages/Partners';
import About from './pages/About';
import ConstructionBanner from './components/ConstructionBanner';
import { CookieConsent } from './components/CookieConsent';

const ProtectedInstructorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const isInstructor = user?.user_metadata.is_instructor;

  if (!isInstructor) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <ConstructionBanner />
        <Navbar />
        <main className="flex-1 container mx-auto px-2 py-2">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/progress" element={<Progress />} />
            <Route 
              path="/evaluate" 
              element={
                <ProtectedInstructorRoute>
                  <Evaluate />
                </ProtectedInstructorRoute>
              } 
            />
            <Route path="/legal" element={<Legal />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </Router>
  );
}

export default App;