import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import { Container, SignIn } from './SignIn';

// graphql mutation for signing up
const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export function RequestReset() {
  // state to toggle the UI after account is created
  const [hasSentReset, setHasSentReset] = useState({
    hasSent: false,
    email: '',
  });

  // set up form data
  const { inputs, handleChange, clearForm } = useForm({
    email: 'test@email.com',
  });

  const [requestReset, { loading, data, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();

    // wait for the reset request
    const res = await requestReset().catch(console.error);

    if (!error) {
      setHasSentReset({
        hasSent: true,
        email: res.data.message,
      });
    }

    // if (res.data.createUser) {
    //   setHasCreatedAccount({
    //     hasCreated: true,
    //     email: res.data.createUser.email,
    //   });

    //   clearForm();
    // }
  }

  return (
    <Container>
      {error && <DisplayError error={error} />}
      {/* if user has been created show welcome text */}
      {hasSentReset.hasSent && (
        <>
          <h2>Reset has been sent to your email!</h2>
          <p>{hasSentReset.message}</p>
        </>
      )}
      {/* if user has not been created show the sign up form */}
      {!hasSentReset.hasSent && (
        <>
          <h2>Password Reset</h2>
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
              <button type="submit">Request Reset</button>
            </fieldset>
          </Form>
        </>
      )}
    </Container>
  );
}

export default RequestReset;
