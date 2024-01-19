import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { useUser } from './User';
import DisplayError from './ErrorMessage';
import { Container, SignIn } from './SignIn';

// graphql mutation for signing up
const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { email: $email, password: $password, name: $name }) {
      id
      email
      name
    }
  }
`;

export function SignUp() {
  // check to see if a user is already logged in
  // probably could move this way towards the top
  const user = useUser();

  // state to toggle the UI after account is created
  const [hasCreatedAccount, setHasCreatedAccount] = useState({
    hasCreated: false,
    email: '',
  });

  // set up form data
  const { inputs, handleChange, clearForm } = useForm({
    email: 'test@email.com',
    password: 'password',
    name: 'name',
  });

  // useMutation returns the signup function and the response data object
  const [signup, { loading, data, error }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
  });

  // if they are already logged in do not show the form
  // needs to at least be after any hooks so they are not conditional
  if (user) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // wait for the signin function
    const res = await signup().catch(console.error);

    if (res.data.createUser) {
      setHasCreatedAccount({
        hasCreated: true,
        email: res.data.createUser.email,
      });

      clearForm();
    }
  }

  return (
    <Container>
      {error && <DisplayError error={error} />}
      {/* if user has been created show welcome text */}
      {hasCreatedAccount.hasCreated && (
        <>
          <h2>Thanks for signin up!</h2>
          <p>You can sign in now with your email: {hasCreatedAccount.email}</p>
          <SignIn />
        </>
      )}
      {/* if user has not been created show the sign up form */}
      {!hasCreatedAccount.hasCreated && (
        <>
          <h2>Sign up for an account</h2>
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
                  required
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
                  required
                  value={inputs.password}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  value={inputs.name}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Sign Up</button>
            </fieldset>
          </Form>
        </>
      )}
    </Container>
  );
}

export default SignUp;
