import Link from 'next/link';
import { object } from 'prop-types';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import { DeleteProduct } from './DeleteProduct';
import { AddToCart } from './AddToCart';

export function Product({ product }) {
  return (
    <>
      <ItemStyles>
        {/* image from cloudinary */}
        <img
          src={product?.photo?.image?.publicUrlTransformed}
          alt={product?.name}
        />
        <Title>
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </Title>
        <PriceTag>{formatMoney(product.price)}</PriceTag>
        <p>{product.description}</p>
        {/* TODO should only show for logged in users */}
        {/* but should not show signup form, link to sign in maybe */}
        <div className="buttonList">
          {/* link to update page, needs the product id for the form */}
          <Link
            href={{
              pathname: 'update',
              query: {
                id: product.id,
              },
            }}
          >
            Edit
          </Link>
          <AddToCart id={product.id} />
          <DeleteProduct id={product.id}>Delete</DeleteProduct>
        </div>
      </ItemStyles>
    </>
  );
}

Product.propTypes = {
  product: object,
};

export default Product;
