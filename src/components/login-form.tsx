import {
  Alert,
  applyTheme,
  Box,
  Button,
  FieldStack,
  FieldWrapper,
  Input,
  Text,
} from 'bumbag';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDB } from '../hooks/use-db';

enum LoginFormMode {
  login = 'Log in',
  signUp = 'Sign up',
}

type FormData = {
  username: string;
  password: string;
};

const Form = applyTheme(Box, {
  styles: {
    base: {
      maxWidth: '300px',
      width: '100vw',
    },
  },
  defaultProps: {
    use: 'form',
  },
});

const LoginForm: FC = () => {
  const [mode, setMode] = useState<LoginFormMode>(LoginFormMode.login);
  const { signIn, signUp } = useDB();
  const { register, handleSubmit, formState } = useForm<FormData>();
  const { isSubmitting } = formState;
  const [globalError, setGlobalError] = useState();

  const onSubmit = handleSubmit(async ({ username, password }) => {
    setGlobalError('');

    // Sign in mode
    if (mode === LoginFormMode.login) {
      try {
        await signIn(username, password);
      } catch (error) {
        setGlobalError('That email and password combination is incorrect.');
      }
    }

    // Sign up mode
    if (mode === LoginFormMode.signUp) {
      try {
        await signUp(username, password);
      } catch (error) {
        // Handle existing account
        setGlobalError('This username is already taken. Please log in.');
        setMode(LoginFormMode.login);
      }
    }
  });

  return (
    <Form onSubmit={onSubmit}>
      <FieldStack spacing='major-3'>
        {globalError && <Alert type='warning'>{globalError}</Alert>}
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
    </Form>
  );
};

export default LoginForm;
