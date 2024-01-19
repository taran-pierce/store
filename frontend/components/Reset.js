import gql from 'graphql-tag';
import { string } from 'prop-types';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import { Container, SignIn } from './SignIn';

// graphql mutation for reset password
const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export function Reset({ token }) {
  // state for errors
  // apollo is not returning them here in error for some reason
  const [hasError, setHasError] = useState({
    hasError: false,
    code: '',
    message: '',
  });

  // set for if user has redeemed token
  const [hasRedeemedToken, setHasRedeemedToken] = useState(false);

  // set up form data
  const { inputs, handleChange, clearForm } = useForm({
    email: '',
    password: '',
    token,
  });

  // get function and data from useMutation for reset
  const [reset, { loading }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  });

  async function handleSubmit(e) {
    e.preventDefault();

    // wait for the reset
    const res = await reset().catch(console.error);

    const { redeemUserPasswordResetToken } = res.data;

    // for any type of failure
    // the redeemUserPasswordResetToken object returns null after redemption
    if (redeemUserPasswordResetToken && redeemUserPasswordResetToken.code) {
      setHasError({
        hasError: true,
        code: redeemUserPasswordResetToken.code,
        message: res.data.redeemUserPasswordResetToken.message,
      });

      return;
    }

    // if redeemUserPasswordResetToken didnt exist, token redeemed
    setHasRedeemedToken(true);
    clearForm();
  }

  return (
    <Container>
      {hasError && <DisplayError error={hasError} />}
      {/* if user has redemeemed token show signin form */}
      {hasRedeemedToken && <SignIn />}
      {/* if user has not redeemed token show new password form */}
      {!hasRedeemedToken && (
        <>
          <h2>Password Reset</h2>
          <h3>Enter your new password</h3>
          <Form method="post" onSubmit={(e) => handleSubmit(e)}>
            <fieldset disabled={loading} aria-disabled={loading}>
              <input
                type="hidden"
                name="token"
                id="token"
                required
                value={inputs.token}
              />
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
                New Password
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
              <button type="submit">Request Reset</button>
            </fieldset>
          </Form>
        </>
      )}
    </Container>
  );
}

Reset.propTypes = {
  token: string,
};

export default Reset;
