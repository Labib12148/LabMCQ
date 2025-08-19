import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';

export function render(url) {
  const helmetContext = {};
  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
  const { helmet } = helmetContext;
  return {
    html,
    head: `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`,
    htmlAttrs: helmet.htmlAttributes.toString(),
    bodyAttrs: helmet.bodyAttributes.toString()
  };
}
