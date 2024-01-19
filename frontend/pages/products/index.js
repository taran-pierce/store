import { useRouter } from 'next/dist/client/router';
import { Products } from '../../components/Products';
import { Pagination } from '../../components/Pagination';

export default function ProductsPage() {
  // useRouter so we can grab our queries
  const { query } = useRouter();

  // comes in as a string from query
  const page = parseInt(query.page);

  return (
    <>
      <Pagination page={page || 1} />
      <Products page={page || 1} />
      <Pagination page={page || 1} />
    </>
  );
}
