import gql from 'graphql-tag';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY, useUser } from './User';
import DisplayError from './ErrorMessage';

// graphql mutation for signing in
const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    # use authenticateUserWithPassword with the email/password
    authenticateUserWithPassword(email: $email, password: $password) {
      # on password success return the user data
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      # on password failure get info on why
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export const Container = styled.div`
  background: var(--white);
  border: 1px solid var(--black);
  padding: 1rem;
`;

export function SignIn() {
  // state for toggling error message
  // apollo is not actually returning the "data" properly from useMutation
  //
  const [hasError, setHasError] = useState({
    hasError: false,
    message: '',
  });

  // set up form data
  const { inputs, handleChange, resetForm } = useForm({
    email: 'test@email.com',
    password: 'password',
  });

  // useMutation returns the signin function and the response data object
  const [signin, { loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    // refetch the current user since they are logged in now
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  // grab current user information
  const user = useUser();

  async function handleSubmit(e) {
    e.preventDefault();

    // wait for the signin function
    const res = await signin();

    // get the user authenticated user
    const { authenticateUserWithPassword } = res.data;

    // error is not coming in from useMutation like normal for some reason
    // catching it here
    if (
      authenticateUserWithPassword &&
      authenticateUserWithPassword.code === 'FAILURE'
    ) {
      // set state for error component
      setHasError({
        hasError: true,
        message: authenticateUserWithPassword?.message,
      });
    }

    // if authentication was successful then reset the form
    // probably send them to another page too
    if (authenticateUserWithPassword && authenticateUserWithPassword.item) {
      resetForm();
      setHasError({
        hasError: false,
        message: '',
      });
      console.log('welcome on in!');
    }
  }

  return (
    <Container>
      {/* if user is already logged in show welcome text */}
      {user && (
        <>
          <h2>Thanks for signing in!</h2>
          <p>Good to see you again {user.name}</p>
        </>
      )}
      {/* if there is no user then show the login form */}
      {!user && (
        <>
          <h2>Sign into your account</h2>
          {hasError && hasError.message && (
            <>
              <DisplayError error={hasError} />
            </>
          )}
          <Form method="post" onSubmit={(e) => handleSubmit(e)}>
            <fieldset disabled={loading} aria-disabled={loading}>
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Your email address"
                  autoComplete="email"
                  value={inputs.email}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="password"
                  value={inputs.password}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Sign In</button>
            </fieldset>
          </Form>
        </>
      )}
    </Container>
  );
}

export default SignIn;
