import React from 'react';
import Layout from './components/Layout';
import StockDiaryPage from './pages/WatchlistPage';
import AuthPage from './components/AuthPage';
import { useAuth } from './hooks/useAuth';
import Spinner from './components/ui/Spinner';
import { supabaseInitializationError } from './services/supabase';

const App: React.FC = () => {
  // Immediately check for a fatal initialization error from the Supabase client module.
  // This is the key to preventing the blank page.
  if (supabaseInitializationError) {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: '#fff5f5',
        color: '#c53030',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Application Initialization Failed
        </h1>
        <pre style={{
          backgroundColor: '#fed7d7',
          padding: '1.5rem',
          borderRadius: '0.25rem',
          border: '1px solid #f56565',
          maxWidth: '800px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          textAlign: 'left',
          lineHeight: '1.5'
        }}>
          {supabaseInitializationError.message}
        </pre>
      </div>
    );
  }

  const { session, loading } = useAuth();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Spinner className="h-10 w-10" />
        </div>
      );
    }

    if (!session) {
      return <AuthPage />;
    }

    return (
       <div className="container mx-auto p-4">
        <StockDiaryPage />
      </div>
    );
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default App;