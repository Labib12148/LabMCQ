import React from 'react';
import { InlineMath } from 'react-katex';

import 'katex/dist/katex.min.css';

/** Insert <br> before list markers / phrase / explicit \n */
const applyLineBreaks = (text, keyPrefix) => {
  if (typeof text !== 'string' || !text) return null;

  // i. / ii. / iii. / Bengali phrase / explicit \n
  const lineBreakPattern = /(i\.|ii\.|iii\.|নিচের কোনটি সঠিক|\\n)/g;

  // Use a harmless marker that won't upset KaTeX
  const processed = text.replace(lineBreakPattern, '⦙BR⦙$&');
  const parts = processed.split('⦙BR⦙');

  return parts.map((part, idx) => {
    if (part === '') return null;
    return (
      <React.Fragment key={`${keyPrefix}-${idx}`}>
        {(processed.startsWith('⦙BR⦙') || idx > 0) ? <br /> : null}
        {part.replace(/\\n/g, '')}
      </React.Fragment>
    );
  });
};

const sanitize = (text) =>
  text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .trim();

/** Treat as math ONLY if proper delimiters exist */
const hasMathDelimiters = (text) => /(\$.*?\$|\\\([^)]*?\\\))/.test(text);

const MathText = ({ text }) => {
  if (typeof text !== 'string' || !text) return null;

  const raw = sanitize(text);

  // No math delimiters → render as truly plain text (normal look)
  if (!hasMathDelimiters(raw)) {
    return <span className="mt-plain">{applyLineBreaks(raw, 'plain')}</span>;
  }

  // Mixed: split into math segments ($...$ or \(...\)) and plain text
  const splitPattern = /(\$.*?\$|\\\([^)]*?\\\))/g;
  const segments = raw.split(splitPattern).filter(Boolean);

  return (
    <span className="mt-root">
      {segments.map((segment, index) => {
        const isMath =
          (segment.startsWith('$') && segment.endsWith('$')) ||
          (segment.startsWith('\\(') && segment.endsWith('\\)'));

        if (isMath) {
          // Strip delimiters
          const mathContent = segment.slice(
            segment.startsWith('$') ? 1 : 2,
            segment.endsWith('$') ? -1 : -2
          );

          // Keep \text{...} as *plain* chunks with our line-breaking
          const subSplitPattern = /(\\text{.*?}|i\.|ii\.|iii\.)/g;
          const subSegments = mathContent.split(subSplitPattern).filter(Boolean);

          if (subSegments.length > 1) {
            return (
              <React.Fragment key={index}>
                {subSegments.map((sub, subIndex) => {
                  if (/^(i\.|ii\.|iii\.)$/.test(sub)) {
                    return (
                      <React.Fragment key={subIndex}>
                        <br />
                        <span className="mt-math">
                          <InlineMath math={sub} throwOnError={false} strict="ignore" />
                        </span>
                      </React.Fragment>
                    );
                  }
                  if (sub.startsWith('\\text{')) {
                    const txt = sanitize(sub.slice(6, -1));
                    return (
                      <span key={subIndex} className="mt-plain">
                        {applyLineBreaks(txt, `math-text-${index}-${subIndex}`)}
                      </span>
                    );
                  }
                  try {
                    return (
                      <span key={subIndex} className="mt-math">
                        <InlineMath math={sub} throwOnError={false} strict="ignore" />
                      </span>
                    );
                  } catch (err) {
                    console.warn('Math render error:', err, sub);
                    return <span key={subIndex} className="mt-plain">{sub}</span>;
                  }
                })}
              </React.Fragment>
            );
          }

          try {
            return (
              <span key={index} className="mt-math">
                <InlineMath math={mathContent} throwOnError={false} strict="ignore" />
              </span>
            );
          } catch (err) {
            console.warn('Math render error:', err, mathContent);
            return <span key={index} className="mt-plain">{mathContent}</span>;
          }
        }

        // Plain text segment inside a mixed string
        return (
          <span key={index} className="mt-plain">
            {applyLineBreaks(segment, `text-${index}`)}
          </span>
        );
      })}
    </span>
  );
};

export default MathText;
