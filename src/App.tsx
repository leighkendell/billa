import { lazy } from '@loadable/component';
import {
  applyTheme,
  Box,
  Button,
  Dialog,
  Flex,
  Modal,
  PageWithHeader,
  Spinner,
  TopNav,
} from 'bumbag';
import React, { FC, Suspense } from 'react';
import { useDB } from './hooks/use-db';
import { ReactComponent as BillaIcon } from './images/billa.svg';

const ExpenseList = lazy(() => import('./components/expense-list'));
const LoginForm = lazy(() => import('./components/login-form'));

const Loader = applyTheme(Flex, {
  styles: {
    base: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
  },
  defaultProps: {
    alignX: 'center',
    alignY: 'center',
  },
});

const App: FC = () => {
  const { user, loading, signOut } = useDB();

  if (loading) {
    return (
      <Loader>
        <Spinner size='large' />
      </Loader>
    );
  }

  return (
    <>
      <PageWithHeader
        header={
          <TopNav>
            <TopNav.Section marginLeft='major-2'>
              <TopNav.Item>
                <Box
                  use={BillaIcon as any}
                  aria-label='Billa'
                  width='48px'
                  height='21px'
                />
              </TopNav.Item>
            </TopNav.Section>
            <TopNav.Section marginRight='major-2'>
              <TopNav.Item>
                {user ? (
                  <>
                    <Button onClick={signOut}>Log out</Button>
                  </>
                ) : (
                  <>
                    <Modal.State animated>
                      <Dialog.Modal baseId='loginForm' fade expand>
                        <Suspense fallback={<Spinner />}>
                          <LoginForm />
                        </Suspense>
                      </Dialog.Modal>
                      <Modal.Disclosure use={Button}>Log in</Modal.Disclosure>
                    </Modal.State>
                  </>
                )}
              </TopNav.Item>
            </TopNav.Section>
          </TopNav>
        }
      >
        {!user && (
          <Box padding='major-2'>
            <span aria-label='wave' role='img'>
              👋
            </span>{' '}
            Welcome to Billa, please log in to access your data.
          </Box>
        )}
        {user && (
          <Suspense fallback={<Spinner alignX='center' padding='major-3' />}>
            <ExpenseList />
          </Suspense>
        )}
      </PageWithHeader>
    </>
  );
};

export default App;
