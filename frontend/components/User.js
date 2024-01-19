import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

export const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      # ... allows you to basically do conditionals
      # authenticatedItem can find and return multiple types
      # so "on" User -> return us this info
      ... on User {
        id
        email
        name
        # todo: get the cart once we make it
      }
    }
  }
`;

export function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY);

  return data?.authenticatedItem;
}
