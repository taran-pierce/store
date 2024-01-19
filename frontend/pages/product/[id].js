import { string } from 'prop-types';
import { SingleProduct } from '../../components/SingleProduct';

// displaying a single product requires the id
export function SingleProductPage({ query }) {
  return <SingleProduct id={query.id} />;
}

SingleProductPage.propTypes = {
  query: string,
};

export default SingleProductPage;
