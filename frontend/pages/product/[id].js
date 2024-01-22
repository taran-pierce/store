import { object } from 'prop-types';
import { SingleProduct } from '../../components/SingleProduct';

// displaying a single product requires the id
export function SingleProductPage({ query }) {
  return <SingleProduct id={query.id} />;
}

SingleProductPage.propTypes = {
  query: object,
};

export default SingleProductPage;
