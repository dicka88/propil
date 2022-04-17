import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function Modal({ open, toggle, children, title, withClose = true }) {
  return (
    <div aria-hidden="true" className={classNames(
      "overflow-y-auto overflow-x-hidden fixed top-0 bg-black bg-opacity-50 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full",
      {
        "hidden": !open
      }
    )}>
      <div className="relative p-4 w-full max-w-2xl h-screen md:h-auto mx-auto my-auto">
        <div className="relative bg-white rounded-lg">
          {title && (
            <div className="flex justify-between items-start p-5 rounded-t border-b">
              <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                {title}
              </h3>
              {withClose && (
                <button type="button" onClick={toggle} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm p-2 ml-auto inline-flex items-center" data-modal-toggle="defaultModal">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
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

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  withClose: PropTypes.bool
};
