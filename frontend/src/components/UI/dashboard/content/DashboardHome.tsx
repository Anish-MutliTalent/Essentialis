// src/components/dashboard/content/DashboardHome.tsx
import { useDashboardContext } from '../../../../pages/DashboardPage'; // Import the context hook

const DashboardHome = () => {
  const { profile } = useDashboardContext(); // Access profile data if needed

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Welcome, {profile?.name || 'User'}!</h2>
      <p>This is your main dashboard area.</p>
      {/* Add overview widgets, stats, etc. */}
    </div>
  );
};
export default DashboardHome;