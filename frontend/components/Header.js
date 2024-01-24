import styled from 'styled-components';
import Link from 'next/link';
import Nav from './Nav';
import { Cart } from './Cart';
import { Search } from './Search';

const Logo = styled.h1`
  background: red;
  margin-left: 2rem;
  font-size: 4rem;
  position: relative;
  transform: skew(-7deg);
  z-index: 2;

  a {
    color: white;
    padding: 0.5rem 1rem;
    text-decoration: none;
    text-transform: uppercase;
  }
`;

const HeaderStyles = styled.header`
  .bar {
    border-bottom: 10px solid var(--black, black);
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
  }

  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid var(--black, black);
  }
`;

function Header() {
  return (
    <HeaderStyles>
      <div className="bar">
        <Logo>
          <Link href="/">Terry Tarantula!</Link>
        </Logo>
        <Nav />
      </div>
      <div className="sub-bar">
        <Search />
      </div>
      <Cart />
    </HeaderStyles>
  );
}

export default Header;
