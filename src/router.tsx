import { createRouter, createRoute, createRootRoute, redirect, Outlet } from '@tanstack/react-router';
import { AuthGuard } from './components/auth/AuthGuard';
import Layout from './components/layout/Layout';
import LoginScreen from './features/auth/LoginScreen';
import DashboardContainer from './features/dashboard/DashboardContainer';
import AnimalsList from './features/animals/AnimalsList';
import AnimalProfile from './features/animals/AnimalProfile';
import HusbandryLogs from './features/husbandry/HusbandryLogs';
import HusbandryTasks from './features/husbandry/Tasks';
import DailyRounds from './features/husbandry/DailyRounds';
import FeedingSchedules from './features/husbandry/FeedingSchedule';
import MedicalRecords from './features/medical/MedicalRecords';
import FlightRecords from './features/logistics/FlightRecords';
import Movements from './features/logistics/Movements';
import StaffRota from './features/staff/StaffRota';
import Timesheets from './features/staff/Timesheets';
import Holidays from './features/staff/Holidays';
import ReportsDashboard from './features/reports/ReportsDashboard';
import MissingRecords from './features/compliance/MissingRecords';
import HelpSupport from './features/help/HelpSupport';
import SettingsLayout from './features/settings/SettingsLayout';
import OrgProfile from './features/settings/tabs/OrgProfile';
import Directory from './features/settings/tabs/Directory';
import OperationalLists from './features/settings/tabs/OperationalLists';
import SystemHealth from './features/settings/tabs/SystemHealth';
import AccessControl from './features/settings/tabs/AccessControl';
import ZLADocuments from './features/settings/tabs/ZLADocuments';
import BugReports from './features/settings/tabs/BugReports';
import Intelligence from './features/settings/tabs/Intelligence';
import Changelog from './features/settings/tabs/Changelog';
import Maintenance from './features/safety/tabs/SiteMaintenance';
import Incidents from './features/safety/tabs/Incidents';
import FirstAid from './features/safety/tabs/FirstAid';
import SafetyDrills from './features/safety/tabs/SafetyDrills';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginScreen,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: () => (
    <AuthGuard>
      <Layout />
    </AuthGuard>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' });
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/dashboard',
  component: DashboardContainer,
});

const animalsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/animals',
});

const animalsIndexRoute = createRoute({
  getParentRoute: () => animalsRoute,
  path: '/',
  component: AnimalsList,
});

const animalProfileRoute = createRoute({
  getParentRoute: () => animalsRoute,
  path: '/$id',
  component: AnimalProfile,
});

const husbandryRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/husbandry',
});

const husbandryIndexRoute = createRoute({
  getParentRoute: () => husbandryRoute,
  path: '/',
  component: HusbandryLogs,
});

const husbandryTasksRoute = createRoute({
  getParentRoute: () => husbandryRoute,
  path: '/tasks',
  component: HusbandryTasks,
});

const husbandryDailyRoundsRoute = createRoute({
  getParentRoute: () => husbandryRoute,
  path: '/daily-rounds',
  component: DailyRounds,
});

const husbandryFeedingSchedulesRoute = createRoute({
  getParentRoute: () => husbandryRoute,
  path: '/feeding-schedules',
  component: FeedingSchedules,
});

const medicalRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/medical',
  component: MedicalRecords,
});

const logisticsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/logistics',
});

const logisticsIndexRoute = createRoute({
  getParentRoute: () => logisticsRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/logistics/flights' });
  },
});

const logisticsFlightsRoute = createRoute({
  getParentRoute: () => logisticsRoute,
  path: '/flights',
  component: FlightRecords,
});

const logisticsMovementsRoute = createRoute({
  getParentRoute: () => logisticsRoute,
  path: '/movements',
  component: Movements,
});

const staffRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/staff',
});

const staffIndexRoute = createRoute({
  getParentRoute: () => staffRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/staff/rota' });
  },
});

const staffRotaRoute = createRoute({
  getParentRoute: () => staffRoute,
  path: '/rota',
  component: StaffRota,
});

const staffTimesheetsRoute = createRoute({
  getParentRoute: () => staffRoute,
  path: '/timesheets',
  component: Timesheets,
});

const staffHolidaysRoute = createRoute({
  getParentRoute: () => staffRoute,
  path: '/holidays',
  component: Holidays,
});

const reportsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/reports',
});

const reportsIndexRoute = createRoute({
  getParentRoute: () => reportsRoute,
  path: '/',
  component: ReportsDashboard,
});

const reportsComplianceRoute = createRoute({
  getParentRoute: () => reportsRoute,
  path: '/compliance',
  component: MissingRecords,
});

const helpRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/help',
  component: HelpSupport,
});

const safetyRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/safety',
});

const safetyMaintenanceRoute = createRoute({
  getParentRoute: () => safetyRoute,
  path: '/maintenance',
  component: Maintenance,
});

const safetyIncidentsRoute = createRoute({
  getParentRoute: () => safetyRoute,
  path: '/incidents',
  component: Incidents,
});

const safetyFirstAidRoute = createRoute({
  getParentRoute: () => safetyRoute,
  path: '/first-aid',
  component: FirstAid,
});

const safetyDrillsRoute = createRoute({
  getParentRoute: () => safetyRoute,
  path: '/drills',
  component: SafetyDrills,
});

const settingsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/settings',
  component: SettingsLayout,
});

const settingsIndexRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/settings/organization' });
  },
});

const settingsOrgRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/organization',
  component: OrgProfile,
});

const settingsDirectoryRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/directory',
  component: Directory,
});

const settingsListsRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/lists',
  component: OperationalLists,
});

const settingsHealthRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/health',
  component: SystemHealth,
});

const settingsAccessRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/access',
  component: AccessControl,
});

const settingsZlaRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/zla',
  component: ZLADocuments,
});

const settingsBugsRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/bugs',
  component: BugReports,
});

const settingsIntelligenceRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/intelligence',
  component: Intelligence,
});

const settingsChangelogRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/changelog',
  component: Changelog,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authRoute.addChildren([
    indexRoute,
    dashboardRoute,
    animalsRoute.addChildren([animalsIndexRoute, animalProfileRoute]),
    husbandryRoute.addChildren([
      husbandryIndexRoute,
      husbandryTasksRoute,
      husbandryDailyRoundsRoute,
      husbandryFeedingSchedulesRoute,
    ]),
    medicalRoute,
    logisticsRoute.addChildren([
      logisticsIndexRoute,
      logisticsFlightsRoute,
      logisticsMovementsRoute,
    ]),
    staffRoute.addChildren([
      staffIndexRoute,
      staffRotaRoute,
      staffTimesheetsRoute,
      staffHolidaysRoute,
    ]),
    reportsRoute.addChildren([reportsIndexRoute, reportsComplianceRoute]),
    helpRoute,
    safetyRoute.addChildren([
      safetyMaintenanceRoute,
      safetyIncidentsRoute,
      safetyFirstAidRoute,
      safetyDrillsRoute,
    ]),
    settingsRoute.addChildren([
      settingsIndexRoute,
      settingsOrgRoute,
      settingsDirectoryRoute,
      settingsListsRoute,
      settingsHealthRoute,
      settingsAccessRoute,
      settingsZlaRoute,
      settingsBugsRoute,
      settingsIntelligenceRoute,
      settingsChangelogRoute,
    ]),
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <div className="p-8 text-center text-slate-500 font-bold">404 - Page Not Found</div>
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
