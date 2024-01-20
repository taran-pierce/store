import { createContext, useContext, useState } from 'react';
import { any } from 'prop-types';

const LocalStateContext = createContext();

const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // custom provider
  // cart open state
  const [cartOpen, setCartOpen] = useState(false);

  // different ways to interact with the cart
  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function openCart() {
    setCartOpen(true);
  }

  function closeCart() {
    setCartOpen(false);
  }

  return (
    <LocalStateProvider
      value={{
        cartOpen,
        setCartOpen,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </LocalStateProvider>
  );
}

// hook for accessing the cart state
function useCart() {
  const all = useContext(LocalStateContext);

  return all;
}

CartStateProvider.propTypes = {
  children: any,
};

export { CartStateProvider, useCart };
