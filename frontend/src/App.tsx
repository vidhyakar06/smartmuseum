import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { VisitorProvider } from './contexts/VisitorContext.js';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext.js';
import { VisitorLayout } from './layouts/VisitorLayout.js';
import { AdminLayout } from './layouts/AdminLayout.js';

// Visitor Pages
import { LandingPage } from './pages/LandingPage.js';
import { ExplorePage } from './pages/ExplorePage.js';
import { ExhibitDetailPage } from './pages/ExhibitDetailPage.js';
import { IndoorMapPage } from './pages/IndoorMapPage.js';
import { AIGuidePage } from './pages/AIGuidePage.js';
import { LanguagePage } from './pages/LanguagePage.js';
import { VisitorProfilePage } from './pages/VisitorProfilePage.js';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminExhibitsPage } from './pages/admin/AdminExhibitsPage.js';
import { AdminGalleriesPage } from './pages/admin/AdminGalleriesPage.js';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage.js';
import { AdminTicketsPage } from './pages/admin/AdminTicketsPage.js';
import { AdminVisitorsPage } from './pages/admin/AdminVisitorsPage.js';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.js';

// Protected Admin Route
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <VisitorProvider>
          <Routes>
            {/* Visitor Flow */}
            <Route path="/" element={<VisitorLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="exhibit/:id" element={<ExhibitDetailPage />} />
              <Route path="scan" element={<Navigate to="/explore" replace />} />
              <Route path="map" element={<IndoorMapPage />} />
              <Route path="ai" element={<AIGuidePage />} />
              <Route path="languages" element={<LanguagePage />} />
              <Route path="profile" element={<VisitorProfilePage />} />
            </Route>

            {/* Admin Flow */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="visitors" element={<AdminVisitorsPage />} />
              <Route path="exhibits" element={<AdminExhibitsPage />} />
              <Route path="galleries" element={<AdminGalleriesPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="tickets" element={<AdminTicketsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </VisitorProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;
