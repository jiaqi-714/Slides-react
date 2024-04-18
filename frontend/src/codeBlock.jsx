// CodeBlock.jsx
import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import PropTypes from 'prop-types';

const CodeBlock = ({ code, language, style }) => {
  CodeBlock.propTypes = {
    code: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    style: PropTypes.object
  };

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      hljs.highlightElement(ref.current);
    }
  }, [code]); // Dependency on code to re-highlight if it changes

  return (
    <pre style={style}>
      <code ref={ref} className={language} style={style}>
        {code}
      </code>
    </pre>
  );
};

export default CodeBlock;
