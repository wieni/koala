import React from 'react';
import WebFont from 'webfontloader';
import { hot } from 'react-hot-loader/root';

const App = () => {
  WebFont.load({
    google: {
      families: ['Roboto:400,500'],
    },
  });

  return (
    <React.Fragment>
      <h1>Koala</h1>
      <h2>{version}</h2>
    </React.Fragment>
  );
};

export default hot(App);
