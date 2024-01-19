/* eslint-disable react/jsx-props-no-spreading */
import Document, { Html, Head, NextScript, Main } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  // this will collect all stylesheets and prevent fouc
  static getInitialProps({ renderPage }) {
    // set up new server stylesheet
    const sheet = new ServerStyleSheet();

    // call renderPage and pass it function that collects all the styles from the App
    const page = renderPage(
      (App) => (props) => sheet.collectStyles(<App {...props} />)
    );

    // grabs the style element it creates
    const styleTags = sheet.getStyleElement();

    // return the page with the style tags
    return {
      ...page,
      styleTags,
    };
  }

  render() {
    return (
      <>
        <Html lang="en-US">
          <Head />
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      </>
    );
  }
}
