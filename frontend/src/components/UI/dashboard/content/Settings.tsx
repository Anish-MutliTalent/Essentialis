import React from 'react';
import { Button, Card, CardHeader, CardContent, Heading, Text } from '../../index';

const Settings: React.FC = () => {
  const clearLocal = () => {
    if (!confirm('Clear local application data?')) return;
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card variant="professional">
        <CardHeader>
          <Heading level={2}>Settings</Heading>
        </CardHeader>
        <CardContent>
          <Text color="muted">All configurable client-side settings have been removed.</Text>
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={clearLocal}>Clear Local Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
