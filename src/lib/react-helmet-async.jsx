import React, { useEffect } from 'react';

export function HelmetProvider({ children }) {
  return <>{children}</>;
}

export function Helmet({ children }) {
  useEffect(() => {
    const nodes = [];
    React.Children.forEach(children, (child) => {
      if (!child) return;
      if (child.type === 'title') {
        document.title = child.props.children;
      } else if (child.type === 'meta' || child.type === 'link') {
        const el = document.createElement(child.type);
        Object.entries(child.props).forEach(([k, v]) => el.setAttribute(k, v));
        document.head.appendChild(el);
        nodes.push(el);
      }
    });
    return () => nodes.forEach((n) => document.head.removeChild(n));
  }, [children]);
  return null;
}

export default Helmet;
