
import React from 'react';
import { supabase } from '../services/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { useTheme } from '../contexts/ThemeContext';

const AuthPage: React.FC = () => {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to StockDiary</CardTitle>
            <CardDescription>Sign in to continue to your personal dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['google', 'github']}
              theme={isDark ? 'dark' : 'default'}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
