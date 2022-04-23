import React from 'react';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';

export default function BackdropLoader({ open, onClick }) {
  if (!open) return null;

  return (
    <div className="fixed top-0 h-screen w-screen z-10 bg-black bg-opacity-70 flex justify-center items-center" onClick={onClick}>
      <ReactLoading type="spin" color="#fff" height={32} width={32} />
    </div>
  );
}

BackdropLoader.defaultProps = {
  open: false,
  onClick: null,
};

BackdropLoader.propTypes = {
  open: PropTypes.bool,
  onClick: PropTypes.func,
};
