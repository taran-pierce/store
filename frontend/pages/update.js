import { string } from 'prop-types';
import { UpdateProduct } from '../components/UpdateProduct';

export function UpdatePage({ query }) {
  console.log({ query });
  return (
    <>
      <UpdateProduct id={query.id} />
    </>
  );
}

UpdatePage.propTypes = {
  query: string,
};

export default UpdatePage;
