import { object } from 'prop-types';
import { RequestReset } from '../components/RequestReset';
import { Reset } from '../components/Reset';

export function ResetPage({ query }) {
  // if the token param is missing show reset password form
  if (!query?.token) {
    return <RequestReset />;
  }

  return (
    <>
      <Reset token={query?.token} />
    </>
  );
}

ResetPage.propTypes = {
  query: object,
};

export default ResetPage;
