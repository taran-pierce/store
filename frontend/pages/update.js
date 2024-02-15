import { object } from 'prop-types';
import { UpdateProduct } from '../components/UpdateProduct';

export function UpdatePage({ query }) {
  return (
    <>
      <UpdateProduct id={query.id} />
    </>
  );
}

UpdatePage.propTypes = {
  query: object,
};

export default UpdatePage;
