import React, { FC, useState } from 'react';
import {
  FieldWrapper,
  Input,
  Button,
  FieldStack,
  Modal,
  Dialog,
  Text,
  Box,
  Alert,
} from 'bumbag';
import { useDB } from '../hooks/use-db';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

enum LoginFormMode {
  login = 'Log in',
  signUp = 'Sign up',
}

type FormData = {
  username: string;
  password: string;
  globalError: string;
};

const LoginForm: FC = () => {
  const [mode, setMode] = useState<LoginFormMode>(LoginFormMode.login);
  const { signIn, signUp } = useDB();
  const { register, handleSubmit, setError, errors, formState } = useForm<
    FormData
  >();
  const { isSubmitting } = formState;

  const onSubmit = handleSubmit(async ({ username, password }) => {
    // Sign in mode
    if (mode === LoginFormMode.login) {
      try {
        await signIn(username, password);
      } catch (error) {
        setError('globalError', {
          type: 'manual',
          message: 'That email and password combination is incorrect.',
        });
      }
    }

    // Sign up mode
    if (mode === LoginFormMode.signUp) {
      try {
        await signUp(username, password);
      } catch (error) {
        // Handle existing account
        setError('globalError', {
          type: 'manual',
          message: 'This email is already taken. Please log in.',
        });
        setMode(LoginFormMode.login);
      }
    }
  });

  return (
    <Box>
      <Modal.State>
        <Dialog.Modal baseId='loginForm'>
          <form onSubmit={onSubmit}>
            <FieldStack spacing='major-3'>
              <ErrorMessage
                errors={errors}
                name='globalError'
                as={({ children }: any) => (
                  <Alert type='warning'>{children}</Alert>
                )}
              />
              <FieldWrapper label='Username'>
                <Input name='username' ref={register({ required: true })} />
              </FieldWrapper>
              <FieldWrapper label='Password'>
                <Input
                  name='password'
                  type='password'
                  ref={register({ required: true })}
                />
              </FieldWrapper>
              <Button type='submit' palette='primary' isLoading={isSubmitting}>
                {mode}
              </Button>
            </FieldStack>

            <Box marginTop='major-1'>
              {mode === LoginFormMode.login && (
                <Text>
                  No account?{' '}
                  <Button
                    type='button'
                    variant='link'
                    onClick={() => setMode(LoginFormMode.signUp)}
                  >
                    Create one
                  </Button>
                </Text>
              )}

              {mode === LoginFormMode.signUp && (
                <Text>
                  Already have an account?{' '}
                  <Button
                    type='button'
                    variant='link'
                    onClick={() => setMode(LoginFormMode.login)}
                  >
                    Log in
                  </Button>
                </Text>
              )}
            </Box>
          </form>
        </Dialog.Modal>
        <Modal.Disclosure use={Button}>Log in</Modal.Disclosure>
      </Modal.State>
    </Box>
  );
};

export default LoginForm;
