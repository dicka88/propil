import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function Input({ className, isError, name, register, registerConfig, ...rest }) {
  return (
    <input
      {...(register && register(name, registerConfig))}
      className={classNames("bg-gray-100 w-full py-2 px-2 rounded-lg resize-none focus:ring-black focus:outline-black focus:border-black", className, {
        "border border-red-500": isError
      })}
      {...rest}
    />
  );
}

Input.propTypes = {
  className: PropTypes.string,
  isError: PropTypes.bool,
  name: PropTypes.string,
  register: PropTypes.any,
  registerConfig: PropTypes.object
};