import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ModalAuth from '../index';

describe('Modal Auth Component', () => {
  it('should defined', () => {
    expect(ModalAuth).toBeDefined();
  });

  it('should render signin on initial', () => {
    render(<ModalAuth open />);

    const signin = screen.getByText('Sign In');

    expect(signin).toBeInTheDocument();
  });

  it('should render signup on click signin link', () => {
    render(<ModalAuth open />);

    const signupLink = screen.getByText('signup');

    fireEvent.click(signupLink);

    const signup = screen.getByText('Sign Up');

    expect(signup).toBeInTheDocument();
  });
});
