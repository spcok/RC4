import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, persister } from './lib/queryClient';
import { AuthGuard } from './components/auth/AuthGuard';
import { Layout } from './components/layout/Layout';
import { LoginScreen } from './features/auth/LoginScreen';
import { DashboardContainer } from './features/dashboard/DashboardContainer';
import { AnimalsList } from './features/animals/AnimalsList';
import { AnimalProfile } from './features/animals/AnimalProfile';
import { HusbandryLogs } from './features/husbandry/HusbandryLogs';
import { MedicalRecords } from './features/medical/MedicalRecords';
import { FlightRecords } from './features/logistics/FlightRecords';
import { Movements } from './features/logistics/Movements';
import { StaffRota } from './features/staff/StaffRota';
import { Timesheets } from './features/staff/Timesheets';
import { Holidays } from './features/staff/Holidays';
import { ReportsDashboard } from './features/reports/ReportsDashboard';
import { MissingRecords } from './features/compliance/MissingRecords';
import { HelpSupport } from './features/help/HelpSupport';
import { SettingsLayout } from './features/settings/SettingsLayout';
import { OrgProfile } from './features/settings/tabs/OrgProfile';
import { Directory } from './features/settings/tabs/Directory';
import { OperationalLists } from './features/settings/tabs/OperationalLists';
import { SystemHealth } from './features/settings/tabs/SystemHealth';
import { AccessControl } from './features/settings/tabs/AccessControl';
import { ZLADocuments } from './features/settings/tabs/ZLADocuments';
import { BugReports } from './features/settings/tabs/BugReports';
import { Intelligence } from './features/settings/tabs/Intelligence';
import { Changelog } from './features/settings/tabs/Changelog';
import { Migration } from './features/settings/tabs/Migration';

export default function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardContainer />} />
            
            <Route path="animals">
              <Route index element={<AnimalsList />} />
              <Route path=":id" element={<AnimalProfile />} />
            </Route>

            <Route path="husbandry" element={<HusbandryLogs />} />
            <Route path="medical" element={<MedicalRecords />} />
            
            <Route path="logistics">
              <Route index element={<Navigate to="flights" replace />} />
              <Route path="flights" element={<FlightRecords />} />
              <Route path="movements" element={<Movements />} />
            </Route>

            <Route path="staff">
              <Route index element={<Navigate to="rota" replace />} />
              <Route path="rota" element={<StaffRota />} />
              <Route path="timesheets" element={<Timesheets />} />
              <Route path="holidays" element={<Holidays />} />
            </Route>

            <Route path="reports">
              <Route index element={<ReportsDashboard />} />
              <Route path="compliance" element={<MissingRecords />} />
            </Route>

            <Route path="help" element={<HelpSupport />} />

            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="organization" replace />} />
              <Route path="organization" element={<OrgProfile />} />
              <Route path="directory" element={<Directory />} />
              <Route path="lists" element={<OperationalLists />} />
              <Route path="health" element={<SystemHealth />} />
              <Route path="access" element={<AccessControl />} />
              <Route path="zla" element={<ZLADocuments />} />
              <Route path="bugs" element={<BugReports />} />
              <Route path="intelligence" element={<Intelligence />} />
              <Route path="changelog" element={<Changelog />} />
              <Route path="migration" element={<Migration />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </PersistQueryClientProvider>
  );
}
