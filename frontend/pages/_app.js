/* eslint-disable react/jsx-props-no-spreading */
import { any } from 'prop-types';
import NProgress from 'nprogress';
import Router from 'next/router';
import { ApolloProvider } from '@apollo/client';
import Page from '../components/Page';
import withData from '../lib/withData';

import '../components/styles/nprogress.css';

// using Router events to have sweet little progress bar
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// wrap the whole app in the apollo provider
// Page component gives us our main repeated layout
// Component to render all the other NextJS children and pass along all the page props
function MyApp({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
}

MyApp.propTypes = {
  Component: any,
  pageProps: any,
  apollo: any,
};

// grab data serverside and pass to props
MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};

  // check to see if any components have getIntialProps
  if (Component.getInitialProps) {
    // wait for those and pass them the current context
    pageProps = await Component.getInitialProps(ctx);
  }

  // pageProps query should be the context query
  pageProps.query = ctx.query;

  // return the pageProps
  return { pageProps };
};

// withData will add all the apollo data to the app
// allowing access to the db any where
export default withData(MyApp);
