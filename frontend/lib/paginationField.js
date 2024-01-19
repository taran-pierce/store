// graphql query from Pagination component
import { PAGINATION_QUERY } from '../components/Pagination';

// keep this cause its from Apollo if you want to manage
// your own cache all in one grouping while using pagination
// other wise it groups your queries in the pages they were called
// and things get weird when/if you start deleting them
export default function paginationField() {
  return {
    keyArgs: false, // tells apollo that we will take care of it
    // read() has two args, the "existing" array and an object with "args" and "cache"
    read(existing = [], { args, cache }) {
      // get the skip and first that is passed
      const { skip, first } = args;

      // read the number of items on the page from cache
      // readQuery from "cache" uses the graphql
      const data = cache.readQuery({ query: PAGINATION_QUERY });

      // get the total count
      const count = data?._allProductsMeta?.count;

      // amount skipped divided by the amount allowed + 1
      // gives you the current page
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // grab items from our array starting with our "skip"
      // ending with "skip + first"
      // the extra .filter will remove "undefined"s from the slice
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // if there are items
      // there are not enough for a whole page
      // and we are on the last page
      // just send it any way
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      // do we have the same amount of items
      if (items.length !== first) {
        return false;
      }

      // if we have cached items return them
      if (items.length) {
        return items;
      }

      // make network request cause neither conditions were true
      return false;
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;

      // create a shallow copy of the existing cache array if there is one
      const merged = existing ? existing.slice(0) : [];

      // eslint-disable-next-line no-plusplus
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }

      return merged;
      // runs when read comes back from network request
    },
  };
}
