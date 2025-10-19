// src/components/dashboard/content/DashboardHome.tsx
import { useDashboardContext } from "../../../../pages/DashboardPage";
import { useDocs } from "../../../contexts/DocsContext";
import { Heading, Text, Card, CardContent, Grid } from "../../index";
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Zap, Plus, Settings } from 'lucide-react';

const DashboardHome = () => {
  const { profile } = useDashboardContext();
  const { docs, loading } = useDocs();
  const navigate = useNavigate();

  // try cached docs first
  let cachedDocs: any[] = [];
  try {
    const raw = localStorage.getItem("mydocs");
    if (raw) cachedDocs = JSON.parse(raw);
  } catch {
    cachedDocs = [];
  }

  const totalDocs = cachedDocs.length > 0 ? cachedDocs.length : docs.length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4 py-6">
        <Heading level={1} className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4 text-2xl sm:text-3xl lg:text-4xl">
          Welcome back, {profile?.name || "User"}!
        </Heading>
        <Text
          variant="lead"
          color="muted"
          className="max-w-2xl mx-auto text-base sm:text-lg"
        >
          This is your main dashboard area. Manage your documents, view
          statistics, and stay organized.
        </Text>
      </div>

      {/* Overview Cards */}
      <Grid cols={3} className="gap-4 sm:gap-6">
        <Card variant="professional" className="text-center">
          <CardContent className="p-4 sm:p-6">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-400" />
            </div>
            <Heading level={4} className="mb-2">
              Total Documents
            </Heading>
            <Text
              variant="lead"
              className="text-3xl font-bold text-yellow-400"
            >
              {loading ? "…" : totalDocs}
            </Text>
          </CardContent>
        </Card>

        <Card variant="professional" className="text-center">
          <CardContent className="p-4 sm:p-6">
            <div className="w-12 h-12 bg-green-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <Heading level={4} className="mb-2">
              Verified
            </Heading>
            <Text
              variant="lead"
              className="text-3xl font-bold text-green-400"
            >
              {loading ? "…" : totalDocs}
            </Text>
          </CardContent>
        </Card>

        <Card variant="professional" className="text-center">
          <CardContent className="p-4 sm:p-6">
            <div className="w-12 h-12 bg-blue-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <Heading level={4} className="mb-2">
              Recent Activity
            </Heading>
            <Text
              variant="lead"
              className="text-3xl font-bold text-blue-400"
            >
              {loading ? "…" : totalDocs}
            </Text>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Card variant="premium">
        <CardContent className="p-6 sm:p-8">
          <Heading level={3} className="text-center mb-4 sm:mb-6 text-lg sm:text-xl">Quick Actions</Heading>
          {/* Use a responsive grid: 2 columns on mobile, 3 on sm+. Make the last tile span 2 cols on mobile so it centers below the first two. auto-rows-fr forces equal heights. */}
          <div className="grid grid-cols-2 sm:grid-cols-3 justify-items-center gap-3 sm:gap-4 auto-rows-fr">
            {/* Quick Upload */}
            <div className="w-[120px] sm:w-[140px]">
              <input
                id="quick-upload-home"
                type="file"
                accept="*/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    (window as any).__quickUploadFile = file;
                  } catch {}
                  navigate('/dashboard/mint-doc', { state: { quickFile: file } });
                }}
              />
              <label htmlFor="quick-upload-home" className="cursor-pointer group block h-full">
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3 sm:p-4 hover:bg-yellow-400/20 transition-all-smooth group-hover:border-yellow-400/50 flex flex-col items-center justify-center h-full">
                  <div className="w-8 h-8 bg-yellow-400/20 rounded-full mb-2 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-yellow-400" />
                  </div>
                  <Text variant="small" className="text-yellow-400 font-medium text-center">Quick Upload</Text>
                </div>
              </label>
            </div>

            {/* View Documents */}
            <div className="w-[120px] sm:w-[140px]">
              <button
                onClick={() => navigate('/dashboard/my-docs')}
                className="group block w-full h-full"
              >
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-gray-800/70 transition-all-smooth group-hover:border-gray-600 flex flex-col items-center justify-center h-full">
                  <div className="w-8 h-8 bg-gray-600/50 rounded-full mb-2 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-300" />
                  </div>
                  <Text variant="small" className="text-gray-300 font-medium text-center">View Documents</Text>
                </div>
              </button>
            </div>

            {/* Settings: span 2 columns on mobile to center below the first two */}
            <div className="col-span-2 sm:col-auto flex justify-center w-full">
              <div className="w-[120px] sm:w-[140px]">
                <button
                  onClick={() => navigate('/dashboard/settings')}
                  className="group block w-full h-full"
                >
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-gray-800/70 transition-all-smooth group-hover:border-gray-600 flex flex-col items-center justify-center h-full">
                    <div className="w-8 h-8 bg-gray-600/50 rounded-full mb-2 flex items-center justify-center">
                      <Settings className="w-4 h-4 text-gray-300" />
                    </div>
                    <Text variant="small" className="text-gray-300 font-medium text-center">Settings</Text>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
