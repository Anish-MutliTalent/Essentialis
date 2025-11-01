import React from 'react';
import { Button, Card, CardHeader, CardContent, Heading, Text } from '../../index';

const Settings: React.FC = () => {
  const clearLocal = () => {
    if (!confirm('Clear local application data? Have you tried disconnecting and reconnecting your wallet?')) return;
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
          <Text color="muted">This is a destructive action so please use carefully. This is only to be used if the Disconnect Wallet function doesn't work as expected.</Text>
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={clearLocal}>Clear Local Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
