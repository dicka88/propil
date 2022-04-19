import React, { useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function Modal({
  open, toggle, children, title, withClose = true,
}) {
  const modalRef = useRef();
  const handleOverlayClick = (e) => {
    e.stopPropagation();

    if (modalRef.current && !modalRef.current.contains(e.target)) {
      toggle();
    }
  };

  return (
    <div
      data-testid="modal"
      aria-hidden="true"
      className={classNames(
        'overflow-y-auto transition-all opacity-0 duration-100 invisible select-none overflow-x-hidden fixed top-0 bg-black bg-opacity-50 right-0 left-0 z-50 w-full md:inset-0  h-full',
        {
          '!visible opacity-100': open,
        },
      )}
      onClick={handleOverlayClick}
    >
      <div className="p-4 w-full max-w-2xl h-screen md:h-auto mx-auto my-auto">
        <div ref={modalRef} className="relative bg-white rounded-lg overflow-hidden">
          {title && (
            <div className="flex justify-between items-start p-5 rounded-t border-b">
              <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                {title}
              </h3>
              {withClose && (
                <button data-testid="close_button" type="button" onClick={toggle} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm p-2 ml-auto inline-flex items-center" data-modal-toggle="defaultModal">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              )}
            </div>
          )}
          <div className="p-6 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

Modal.defaultProps = {
  title: '',
  withClose: true,
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  withClose: PropTypes.bool,
};
