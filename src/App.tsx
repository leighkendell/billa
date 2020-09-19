import React, { FC } from 'react';
import { useDB } from './hooks/use-db';
import LoginForm from './components/login-form';
import { Spinner } from 'bumbag';

const App: FC = () => {
  const { user, loading } = useDB();

  if (user && !loading) {
    console.log(user);
    return null;
  }

  if (!user && !loading) {
    return <LoginForm />;
  }

  return <Spinner padding='major-4' size='large' alignX='center' />;
};

export default App;
