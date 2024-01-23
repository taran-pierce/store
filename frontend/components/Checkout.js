import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import nProgress from 'nprogress';
import { useRouter } from 'next/dist/client/router';
import SickButton from './styles/SickButton';
// import DisplayError from './ErrorMessage';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

// payment library
const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

// graphql for creating the order
// will need the token returned from stripe
const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

export function CheckoutForm() {
  // couple things for state
  // going to have custom errors and loading
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  // set up stripe
  const stripe = useStripe();

  // set up elements from stripe
  const elements = useElements();

  // pull in close cart method
  const { closeCart } = useCart();

  // pull in the router for after a good payment
  const router = useRouter();

  // get the checkout function and error state from useMutation
  const [checkout, { error: graphQlError }] = useMutation(
    CREATE_ORDER_MUTATION,
    // refetch the current user after its done to clear the cart ui
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();

    // set loading UI
    setLoading(true);
    nProgress.start();

    // create payment method via stripe (Token comes back when successful)
    // "error" are stripe validation errors
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      // "CardElement" is provided by stripe
      card: elements.getElement(CardElement),
    });

    // handle errors from stripe
    if (error) {
      // set error, stop progress and return because there was an error
      setError(error);
      nProgress.done();

      return;
    }

    // perform checkout mutation to create the actual order
    // pass it the token from stripe
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });

    // change the page to view the order
    router.push({
      pathname: '/order',
      query: { id: order.data.checkout.id },
    });

    // close the cart and turn off loader
    closeCart();
    setLoading(false);
    nProgress.done();
  }

  return (
    <CheckoutFormStyles onSubmit={(e) => handleSubmit(e)}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      <CardElement />
      <SickButton type="submit" disabled={loading}>
        Checkout Now
      </SickButton>
    </CheckoutFormStyles>
  );
}

// part of the stripe client needed to be wrapped in the Elements provider
// so this part is extracted out
export function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;
