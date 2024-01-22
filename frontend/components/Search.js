/* eslint-disable react/jsx-props-no-spreading */
// import { string } from 'prop-types';
import debounce from 'lodash.debounce';
import router from 'next/router';
import { resetIdCounter, useCombobox, getItemProps } from 'downshift';
import gql from 'graphql-tag';
// useLazyQuery to fetch on demand instead of at render
// similar to useMutation
import { useLazyQuery } from '@apollo/client';
import { SearchStyles, DropDown, DropDownItem } from './styles/DropDown';

// graphql query for looking for product that matches search term
const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    searchTerms: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

// downshift.js - library for helping make accessible search friendly dropdowns
export function Search() {
  const [findItems, { loading, data, error }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    {
      // always use network when searching for these
      fetchPolicy: 'no-cache',
    }
  );

  const items = data?.searchTerms || [];
  const findItemsButWait = debounce(findItems, 50);

  // addresses a rendering issue for React
  // built into downshift
  resetIdCounter();

  const {
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    isOpen,
  } = useCombobox({
    items,
    onInputValueChange() {
      // TODO some kind of bug here
      // when the component re-renders before the debounce is done it stops calling
      // the api, just cancelels all requests moving forward
      findItemsButWait({
        variables: {
          searchTerm: inputValue,
        },
      });
    },
    onSelectedItemChange({ selectedItem }) {
      // when user selects an item, go to the direct page
      router.push({
        pathname: `/product/${selectedItem.id}`,
      });
    },
    // helps downshift show proper name for selected item
    itemToString: (item) => item?.name || '',
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an item',
            id: 'search',
            className: loading ? 'loading' : '',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {/* TODO: isOpen is not triggering to true on focus, only fires after starting to type */}
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              key={item.name}
              {...getItemProps}
              highlighted={index === highlightedIndex}
            >
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
                width="50"
              />
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, no items found for {inputValue}</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}

export default Search;
