import React from 'react';

const FullScreenLoader = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // White background with transparency
        backdropFilter: 'blur(5px)', // Blur effect
        zIndex: 9999, // Ensures it's above all content, including the modal
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {/* You can use a spinning icon or an actual loader component here */}
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p style={{ marginTop: '15px' }}>Loading Lift Details...</p>
    </div>
  );
};

export default FullScreenLoader;

// Note: If you're using Tailwind or a CSS-in-JS library, you'd replace the inline styles. 
// If you are using Bootstrap, the 'spinner-border' and 'visually-hidden' classes will work.