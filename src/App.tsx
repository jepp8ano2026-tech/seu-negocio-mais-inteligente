/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { QuickActionModal } from './components/modals/QuickActionModal';

// Tabs
import { DashboardTab } from './components/dashboard/DashboardTab';
import { AssistantTab } from './components/assistant/AssistantTab';
import { MarketingTab } from './components/marketing/MarketingTab';
import { CreativeStudioTab } from './components/studio/CreativeStudioTab';
import { SocialMediaTab } from './components/social/SocialMediaTab';
import { FinancialTab } from './components/financial/FinancialTab';
import { ScheduleTab } from './components/schedule/ScheduleTab';
import { FiadoTab } from './components/fiado/FiadoTab';
import { ReportsTab } from './components/reports/ReportsTab';
import { NotificationsTab } from './components/notifications/NotificationsTab';
import { SettingsTab } from './components/settings/SettingsTab';

const AppContent: React.FC = () => {
  const { showLandingPage, currentTab, theme } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If public landing page is toggled, render LandingPage
  if (showLandingPage) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <LandingPage />
        <AuthModal />
        <OnboardingModal />
      </div>
    );
  }

  // Inside SaaS Platform
  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-slate-950 text-slate-100 dark'
        : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Top Navbar */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 min-w-0 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {currentTab === 'overview' && <DashboardTab />}
            {currentTab === 'assistant' && <AssistantTab />}
            {currentTab === 'marketing' && <MarketingTab />}
            {currentTab === 'studio' && <CreativeStudioTab />}
            {currentTab === 'social' && <SocialMediaTab />}
            {currentTab === 'financial' && <FinancialTab />}
            {currentTab === 'schedule' && <ScheduleTab />}
            {currentTab === 'fiado' && <FiadoTab />}
            {currentTab === 'reports' && <ReportsTab />}
            {currentTab === 'notifications' && <NotificationsTab />}
            {currentTab === 'settings' && <SettingsTab />}
            {currentTab === 'pricing_plans' && <SettingsTab />}
          </div>
        </main>
      </div>

      {/* Modals */}
      <AuthModal />
      <OnboardingModal />
      <QuickActionModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
