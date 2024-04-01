// CenteredLayout.jsx
import React from 'react';

const CenteredLayout = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '90vh',
      textAlign: 'center'
    }}>
      {children}
    </div>
  );
}

export default CenteredLayout;
