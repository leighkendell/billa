import React, { FC, useEffect } from 'react';
import { useDB } from './hooks/use-db';
import LoginForm from './components/login-form';
import { Spinner, Box, PageContent } from 'bumbag';
import ExpenseList from './components/expense-list';

const App: FC = () => {
  const { user, loading, addExpense, items } = useDB();

  // useEffect(() => {
  //   if (user && !loading) {
  //     console.log('woop');
  //     addExpense({ name: 'test', amount: 200 });
  //   }
  // }, [user, loading]);

  if (user && !loading) {
    return (
      <Box>
        <PageContent>
          <ExpenseList items={items} />
        </PageContent>
      </Box>
    );
  }

  if (!user && !loading) {
    return <LoginForm />;
  }

  return <Spinner padding='major-4' size='large' alignX='center' />;
};

export default App;
