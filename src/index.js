/* eslint-disable react/jsx-filename-extension */
import React from 'react';

const appNode = document.querySelector('#app');

if (appNode) {
  Promise.all([
    import(/* webpackChunkName: "app" */'react-dom'),
    import(/* webpackChunkName: "app" */'./app/index.jsx'),
  ]).then(([
    { render },
    { default: App },
  ]) => {
    console.log('🐨 loves your app.');

    render(<App />, appNode);
  });
} else {
  console.log('🥺 Oh, ow. The required dom node was not found.');
}
