import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements } from '@stripe/react-stripe-js';
import SickButton from './styles/SickButton';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

// TODO: finish checkout
// basic start for connecting to stripe for payments
export function Checkout() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('time to do work');
  }
  return (
    <Elements stripe={stripeLib}>
      <CheckoutFormStyles onSubmit={(e) => handleSubmit(e)}>
        <CardElement />
        <SickButton type="submit">Checkout Now</SickButton>
      </CheckoutFormStyles>
    </Elements>
  );
}

export default Checkout;
