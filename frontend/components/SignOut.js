import gql from 'graphql-tag';
import { any } from 'prop-types';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';

// graphql mutation for signing out
const SIGNOUT_MUTATION = gql`
  # endSession takes no arguments and will log the user out
  mutation SIGNOUT_MUTATION {
    endSession
  }
`;

export function SignOut({ children }) {
  // useMutation to get the signout function
  const [signout, { loading }] = useMutation(SIGNOUT_MUTATION, {
    // after signout make sure to refetch the current user to update the UI
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  async function handleClick() {
    const res = await signout();
  }

  return (
    <>
      <button type="button" onClick={handleClick}>
        {children}
      </button>
    </>
  );
}

SignOut.propTypes = {
  children: any,
};

export default SignOut;
