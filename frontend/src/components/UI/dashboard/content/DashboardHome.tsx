// src/components/dashboard/content/DashboardHome.tsx
import { useDashboardContext } from "../../../../pages/DashboardPage";
import { useDocs } from "../../../contexts/DocsContext";
import { Heading, Text, Card, CardContent, Grid, Flex } from "../../index";
import { useNavigate } from 'react-router-dom';

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
    <div className="space-y-8">
      <div className="text-center">
        <Heading level={1} className="gradient-gold-text mb-4">
          Welcome back, {profile?.name || "User"}!
        </Heading>
        <Text
          variant="lead"
          color="muted"
          className="max-w-2xl mx-auto"
        >
          This is your main dashboard area. Manage your documents, view
          statistics, and stay organized.
        </Text>
      </div>

      {/* Overview Cards */}
      <Grid cols={3} className="gap-6">
        <Card variant="professional" className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
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
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-green-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <Heading level={4} className="mb-2">
              Verified
            </Heading>
            <Text
              variant="lead"
              className="text-3xl font-bold text-green-400"
            >
              {profile?.verifiedCount || 0}
            </Text>
          </CardContent>
        </Card>

        <Card variant="professional" className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-blue-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <Heading level={4} className="mb-2">
              Recent Activity
            </Heading>
            <Text
              variant="lead"
              className="text-3xl font-bold text-blue-400"
            >
              {profile?.recentActivity || 0}
            </Text>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Card variant="premium">
        <CardContent className="p-8">
          <Heading level={3} className="text-center mb-6">Quick Actions</Heading>
          <Flex justify="center" className="gap-4 flex-wrap">
            <button
              onClick={() => navigate('/dashboard/mint-doc')}
              className="group"
            >
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 text-center hover:bg-yellow-400/20 transition-all-smooth group-hover:border-yellow-400/50">
                <div className="w-8 h-8 bg-yellow-400/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <Text variant="small" className="text-yellow-400 font-medium">Create Document</Text>
              </div>
            </button>

            <button
              onClick={() => navigate('/dashboard/my-docs')}
              className="group"
            >
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:bg-gray-800/70 transition-all-smooth group-hover:border-gray-600">
                <div className="w-8 h-8 bg-gray-600/50 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <Text variant="small" className="text-gray-300 font-medium">View Documents</Text>
              </div>
            </button>

            <button
              onClick={() => navigate('/dashboard/settings')}
              className="group"
            >
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:bg-gray-800/70 transition-all-smooth group-hover:border-gray-600">
                <div className="w-8 h-8 bg-gray-600/50 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <Text variant="small" className="text-gray-300 font-medium">Settings</Text>
              </div>
            </button>
          </Flex>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
